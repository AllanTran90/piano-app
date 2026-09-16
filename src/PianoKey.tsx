
type PianoKeyProps = {
  letter: string;
  isActive: boolean;
};

function PianoKey({ letter, isActive }: PianoKeyProps) {
  return (
    <div
      style={{
        width: "40px",
        height: "160px",
        border: "1px solid #333",
        borderRadius: "0 0 6px 6px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "8px",
        backgroundColor: isActive ? "#7f77dd" : "white",
        color: isActive ? "white" : "#333",
        fontSize: "14px",
        textTransform: "uppercase",
      }}
    >
      {letter}
    </div>
  );
}

export default PianoKey;