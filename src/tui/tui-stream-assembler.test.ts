import { describe, expect, it } from "vitest";

import { TuiStreamAssembler } from "./tui-stream-assembler.js";

describe("TuiStreamAssembler", () => {
  it("keeps thinking before content even when thinking arrives later", () => {
    const assembler = new TuiStreamAssembler();
    const first = assembler.ingestDelta(
      "run-1",
      {
        role: "assistant",
        content: [{ type: "text", text: "Hello" }],
      },
      true,
    );
    expect(first.displayText).toBe("Hello");
    expect(first.isThinking).toBe(false);
    expect(first.hasContent).toBe(true);

    const second = assembler.ingestDelta(
      "run-1",
      {
        role: "assistant",
        content: [{ type: "thinking", thinking: "Brain" }],
      },
      true,
    );
    expect(second.displayText).toBe("[thinking]\nBrain\n\nHello");
    expect(second.isThinking).toBe(false);
    expect(second.hasContent).toBe(true);
  });

  it("omits thinking when showThinking is false", () => {
    const assembler = new TuiStreamAssembler();
    const result = assembler.ingestDelta(
      "run-2",
      {
        role: "assistant",
        content: [
          { type: "thinking", thinking: "Hidden" },
          { type: "text", text: "Visible" },
        ],
      },
      false,
    );

    expect(result.displayText).toBe("Visible");
    expect(result.isThinking).toBe(false);
    expect(result.hasContent).toBe(true);
  });

  it("detects thinking phase when only thinking content exists", () => {
    const assembler = new TuiStreamAssembler();
    const result = assembler.ingestDelta(
      "run-thinking",
      {
        role: "assistant",
        content: [{ type: "thinking", thinking: "Pondering..." }],
      },
      true,
    );

    expect(result.displayText).toBe("[thinking]\nPondering...");
    expect(result.isThinking).toBe(true);
    expect(result.hasContent).toBe(false);
  });

  it("falls back to streamed text on empty final payload", () => {
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-3",
      {
        role: "assistant",
        content: [{ type: "text", text: "Streamed" }],
      },
      false,
    );

    const finalText = assembler.finalize(
      "run-3",
      {
        role: "assistant",
        content: [],
      },
      false,
    );

    expect(finalText).toBe("Streamed");
  });

  it("returns null displayText when delta text is unchanged", () => {
    const assembler = new TuiStreamAssembler();
    const first = assembler.ingestDelta(
      "run-4",
      {
        role: "assistant",
        content: [{ type: "text", text: "Repeat" }],
      },
      false,
    );

    expect(first.displayText).toBe("Repeat");

    const second = assembler.ingestDelta(
      "run-4",
      {
        role: "assistant",
        content: [{ type: "text", text: "Repeat" }],
      },
      false,
    );

    expect(second.displayText).toBeNull();
    expect(second.hasContent).toBe(true);
  });
});
