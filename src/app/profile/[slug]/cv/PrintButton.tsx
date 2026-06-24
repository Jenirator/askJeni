'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue text-white text-sm font-semibold px-5 py-1.5 rounded-btn hover:opacity-90"
    >
      Download PDF
    </button>
  )
}
