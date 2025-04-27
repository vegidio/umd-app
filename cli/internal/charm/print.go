package charm

import (
	"fmt"
	"github.com/vegidio/umd-lib"
	"strconv"
	"strings"
)

func PrintSite(name string) {
	fmt.Printf("\n🌍 Website found: %s", green.Render(name))
}

func PrintType(name string) {
	fmt.Printf("; extractor type: %s\n", yellow.Render(name))
}

func PrintCachedResults(typeName string, name string, resp *umd.Response) {
	size := strconv.Itoa(len(resp.Media))
	fmt.Printf("💾 Using cached results for %s %s... %s %s Found\n",
		strings.ToLower(typeName), bold.Render(name), pink.Render("⢿"), bold.Render(size))
}
