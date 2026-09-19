import { KEY_SIZE, type KeyType, type PositionedKey } from "./pianoLayout";

// De två varianterna står bredvid varandra i stället för utspridda ternärer.
const KEY_LOOK: Record<
  KeyType,
  { background: string; color: string; zIndex: number }
> = {
  white: { background: "white", color: "#333", zIndex: 0 },
  black: { background: "#222", color: "white", zIndex: 1 },
};

const ACTIVE_BACKGROUND = "#7f77dd";
const ACTIVE_COLOR = "white";

type PianoKeyProps = {
  data: PositionedKey;
  isActive: boolean;
};

function PianoKey({ data, isActive }: PianoKeyProps) {
  const { width, height } = KEY_SIZE[data.type];
  const look = KEY_LOOK[data.type];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: data.offset,
        width,
        height,
        zIndex: look.zIndex,
        boxSizing: "border-box",
        border: "1px solid #333",
        borderRadius: "0 0 6px 6px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "8px",
        backgroundColor: isActive ? ACTIVE_BACKGROUND : look.background,
        color: isActive ? ACTIVE_COLOR : look.color,
        fontSize: "14px",
        textTransform: "uppercase",
      }}
    >
      {data.letter}
    </div>
  );
}

export default PianoKey;
