package charm

import (
	"fmt"
	"github.com/charmbracelet/bubbles/progress"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/samber/lo"
	"github.com/vegidio/shared"
	"github.com/vegidio/umd-lib/fetch"
	"strconv"
	"time"
)

type tickMsg time.Time

func tickCmd() tea.Cmd {
	return tea.Tick(time.Second/10, func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}

type downloadMsg struct {
	resp *fetch.Response
}

func downloadCmd(ch <-chan *fetch.Response) tea.Cmd {
	return func() tea.Msg {
		if resp, ok := <-ch; ok {
			return downloadMsg{resp}
		}

		return nil
	}
}

type progressModel struct {
	progress      progress.Model
	result        <-chan *fetch.Response
	responses     []*fetch.Response
	total         int
	completed     int
	startTime     time.Time
	lastEtaUpdate time.Time
	eta           time.Duration
}

func (m *progressModel) Init() tea.Cmd {
	return tea.Batch(
		tickCmd(),
		downloadCmd(m.result),
	)
}

func (m *progressModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msgValue := msg.(type) {
	case tickMsg:
		if m.progress.Percent() >= 1 && !m.progress.IsAnimating() {
			m.eta = time.Duration(0)
			return m, tea.Quit
		}

		return m, tickCmd()

	case downloadMsg:
		m.completed++
		m.responses = append(m.responses, msgValue.resp)

		var percent float64
		if m.total > 0 {
			percent = float64(m.completed) / float64(m.total)
		}

		barCmd := m.progress.SetPercent(percent)
		return m, tea.Batch(
			tickCmd(),
			downloadCmd(m.result),
			barCmd,
		)

	case progress.FrameMsg:
		updated, cmd := m.progress.Update(msg)
		m.progress = updated.(progress.Model)
		return m, cmd

	case tea.KeyMsg:
		switch msgValue.String() {
		case "ctrl+c":
			return m, tea.Quit
		}
	}

	return m, nil
}

func (m *progressModel) View() string {
	width := len(strconv.Itoa(m.total))

	percent := m.progress.Percent() * 100
	intPart := int(percent)
	fracPart := int(percent*10) % 10
	percentStr := fmt.Sprintf("%3d.%1d%%", intPart, fracPart)

	now := time.Now()
	if now.Sub(m.lastEtaUpdate) >= time.Second {
		elapsed := time.Since(m.startTime)
		m.eta = shared.CalculateETA(m.total, m.completed, elapsed)
		m.lastEtaUpdate = now
	}

	c := bold.Render(fmt.Sprintf("%0*d", width, m.completed))
	t := bold.Render(fmt.Sprintf("%d", m.total))

	return fmt.Sprintf("\nDownloading   %s%s%s%s%s  %s  %s   %s\n%s\n",
		gray.Render("["), c, gray.Render("/"), t, gray.Render("]"),
		m.progress.View(),
		green.Render(percentStr),
		magenta.Render(fmt.Sprintf("ETA %v", m.eta.Truncate(time.Second/10))),
		printLastFive(width, m.responses),
	)
}

func printLastFive(width int, downloads []*fetch.Response) string {
	lastFive := shared.Last5WithIndex(downloads)

	return lo.Reduce(lastFive, func(acc string, p shared.Pair[*fetch.Response], _ int) string {
		mType := shared.GetMediaType(p.Value.Request.FilePath)
		index := fmt.Sprintf("%0*d", width, p.Index+1)

		var prefix string
		if mType == "video" {
			prefix = fmt.Sprintf("🎬 [%s] Downloading %s", blue.Render(index), orange.Render(mType))
		} else if mType == "image" {
			prefix = fmt.Sprintf("📸 [%s] Downloading %s", blue.Render(index), magenta.Render(mType))
		} else {
			prefix = fmt.Sprintf("✖️ [%s] Downloading %s", blue.Render(index), gray.Render(mType))
		}

		return acc + fmt.Sprintf("\n%s %s",
			prefix,
			cyanUnderline.Render(p.Value.Request.Url),
		)
	}, "")
}

func initProgressModel(result <-chan *fetch.Response, total int) *progressModel {
	p := progress.New(
		progress.WithDefaultGradient(),
		progress.WithoutPercentage(),
		progress.WithWidth(50),
	)

	return &progressModel{
		progress:      p,
		result:        result,
		responses:     make([]*fetch.Response, 0),
		total:         total,
		startTime:     time.Now(),
		lastEtaUpdate: time.Now(),
		eta:           time.Duration(0),
	}
}

func StartProgress(result <-chan *fetch.Response, total int) ([]*fetch.Response, error) {
	model, err := tea.NewProgram(initProgressModel(result, total)).Run()
	if err != nil {
		return nil, err
	}

	m := model.(*progressModel)
	return m.responses, nil
}
