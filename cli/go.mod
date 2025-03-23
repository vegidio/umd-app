module cli

go 1.23.4

require (
	github.com/google/uuid v1.6.0
	github.com/pterm/pterm v0.12.80
	github.com/samber/lo v1.49.1
	github.com/sirupsen/logrus v1.9.3
	github.com/urfave/cli/v2 v2.27.5
	github.com/vegidio/shared v0.0.0-00010101000000-000000000000
	github.com/vegidio/umd-lib v0.0.0-20250323130929-bdf28bbd38d4
)

require (
	atomicgo.dev/cursor v0.2.0 // indirect
	atomicgo.dev/keyboard v0.2.9 // indirect
	atomicgo.dev/schedule v0.1.0 // indirect
	github.com/cavaliergopher/grab/v3 v3.0.1 // indirect
	github.com/containerd/console v1.0.4 // indirect
	github.com/cpuguy83/go-md2man/v2 v2.0.6 // indirect
	github.com/denisbrodbeck/machineid v1.0.1 // indirect
	github.com/go-resty/resty/v2 v2.16.5 // indirect
	github.com/go-rod/rod v0.116.2 // indirect
	github.com/gookit/color v1.5.4 // indirect
	github.com/lithammer/fuzzysearch v1.1.8 // indirect
	github.com/mattn/go-runewidth v0.0.16 // indirect
	github.com/mixpanel/mixpanel-go v1.2.1 // indirect
	github.com/rivo/uniseg v0.4.7 // indirect
	github.com/russross/blackfriday/v2 v2.1.0 // indirect
	github.com/spf13/afero v1.12.0 // indirect
	github.com/xo/terminfo v0.0.0-20220910002029-abceb7e1c41e // indirect
	github.com/xrash/smetrics v0.0.0-20240521201337-686a1a2994c1 // indirect
	github.com/ysmood/fetchup v0.3.0 // indirect
	github.com/ysmood/goob v0.4.0 // indirect
	github.com/ysmood/got v0.40.0 // indirect
	github.com/ysmood/gson v0.7.3 // indirect
	github.com/ysmood/leakless v0.9.0 // indirect
	golang.org/x/net v0.37.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/term v0.30.0 // indirect
	golang.org/x/text v0.23.0 // indirect
)

// Local shared code
replace github.com/vegidio/shared => ../shared
