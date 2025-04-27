package charm

import (
	"fmt"
	"github.com/cavaliergopher/grab/v3"
	"github.com/charmbracelet/bubbles/progress"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/samber/lo"
	"github.com/vegidio/shared"
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
	resp *grab.Response
}

func downloadCmd(ch <-chan *grab.Response) tea.Cmd {
	return func() tea.Msg {
		if resp, ok := <-ch; ok {
			if err := resp.Err(); err != nil {
				return err
			}

			return downloadMsg{resp}
		}

		return nil
	}
}

type progressModel struct {
	progress      progress.Model
	result        <-chan *grab.Response
	downloads     []shared.Download
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

		download := shared.ResponseToDownload(msgValue.resp)
		m.downloads = append(m.downloads, download)

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

	now := time.Now()
	if now.Sub(m.lastEtaUpdate) >= time.Second {
		elapsed := time.Since(m.startTime)
		m.eta = shared.CalculateETA(m.total, m.completed, elapsed)
		m.lastEtaUpdate = now
	}

	return fmt.Sprintf("\nDownloading  [%0*d/%d]  %s  %3d.%1d%%  ETA %v\n%s\n",
		width, m.completed,
		m.total,
		m.progress.View(),
		intPart, fracPart,
		m.eta.Truncate(time.Second/10),
		printLastFive(width, m.downloads),
	)
}

func printLastFive(width int, downloads []shared.Download) string {
	lastFive := shared.Last5WithIndex(downloads)

	return lo.Reduce(lastFive, func(acc string, p shared.Pair[shared.Download], _ int) string {
		mType := shared.GetMediaType(p.Value.FilePath)

		var prefix string
		if mType == "video" {
			prefix = fmt.Sprintf("🎬 [%0*d] Downloading %s", width, p.Index+1, mType)
		} else if mType == "image" {
			prefix = fmt.Sprintf("🏞️ [%0*d] Downloading %s", width, p.Index+1, mType)
		} else {
			prefix = fmt.Sprintf("⁉️ [%0*d] Downloading %s", width, p.Index+1, mType)
		}

		return acc + fmt.Sprintf("\n%s %s",
			prefix,
			p.Value.Url,
		)
	}, "")
}

func initProgressModel(result <-chan *grab.Response, total int) *progressModel {
	p := progress.New(
		progress.WithDefaultGradient(),
		progress.WithoutPercentage(),
		progress.WithWidth(50),
	)

	return &progressModel{
		progress:      p,
		result:        result,
		downloads:     make([]shared.Download, 0),
		total:         total,
		startTime:     time.Now(),
		lastEtaUpdate: time.Now(),
		eta:           time.Duration(0),
	}
}

func StartProgress(result <-chan *grab.Response, total int) ([]shared.Download, error) {
	model, err := tea.NewProgram(initProgressModel(result, total)).Run()
	if err != nil {
		return nil, err
	}

	m := model.(*progressModel)
	return m.downloads, nil
}
