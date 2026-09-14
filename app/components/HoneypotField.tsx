// Bot trap: a field invisible and unreachable to real visitors (sr-only,
// aria-hidden, unfocusable) that spam bots tend to fill in automatically.
// The server silently no-ops the submission when it arrives non-empty.
export default function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="website">אל תמלאו שדה זה</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
