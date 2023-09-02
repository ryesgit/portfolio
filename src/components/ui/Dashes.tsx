import { CSSProperties } from "react"

const Dashes = ({ color }: { color: string }) => {

  const style : CSSProperties = {
    borderBottom: `5px dotted ${color}`,
    width: "100%"
  }

  return (
    <div style={style}></div>
  )
}

export default Dashes