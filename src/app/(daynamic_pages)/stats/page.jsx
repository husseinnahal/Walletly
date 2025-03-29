import Barchart from "./components/barchart"
import Piechart from "./components/pieChart"
import Settings from "@/components/tosettings";

export default function Stats() {
  return (
    <div>
      <Barchart/>
      <Piechart/>
      <Settings/>
    </div>
  )
}
