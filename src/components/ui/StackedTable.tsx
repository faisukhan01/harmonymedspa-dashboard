"use client";

import { useEffect, useRef } from "react";

interface StackedTableProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Always stack below this container width, even if the columns could squeeze in. */
  stackBelow?: number;
}

function labelCells(table: HTMLTableElement) {
  const headers = Array.from(table.tHead?.rows[0]?.cells ?? []).map((cell) =>
    (cell.textContent ?? "").trim(),
  );
  for (const body of Array.from(table.tBodies)) {
    for (const row of Array.from(body.rows)) {
      let column = 0;
      for (const cell of Array.from(row.cells)) {
        const label = cell.colSpan > 1 ? "" : (headers[column] ?? "");
        if (cell.dataset.label !== label) cell.dataset.label = label;
        column += cell.colSpan;
      }
    }
  }
}

/**
 * Wraps a <table> so it never scrolls sideways: when the columns can't fit the
 * available width, each row reflows into a stacked card labelled from the header.
 * Uses the container's width, not the viewport's, because the sidebar and modals
 * change how much room a table really has at a given screen size.
 */
export default function StackedTable({
  children,
  className,
  style,
  stackBelow = 0,
}: StackedTableProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let frame = 0;
    let observedTable: HTMLTableElement | null = null;
    const measure = () => {
      frame = 0;
      const table = wrapper.querySelector("table");
      const width = wrapper.clientWidth;
      if (!table || width === 0) return;
      if (table !== observedTable) {
        if (observedTable) resizeObserver.unobserve(observedTable);
        resizeObserver.observe(table);
        observedTable = table;
      }
      labelCells(table);
      // Lay the table out unstacked to learn its true width; no paint happens in between.
      delete wrapper.dataset.stacked;
      const stacked = width < stackBelow || table.offsetWidth > width + 1;
      if (stacked) wrapper.dataset.stacked = "true";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // The table is observed too: late fonts or re-rendered text can widen it
    // without the wrapper changing size.
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(wrapper);
    // Rows arrive after the first render, and cell text can change in place.
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(wrapper, { childList: true, characterData: true, subtree: true });
    measure();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [stackBelow]);

  return (
    <div
      ref={wrapperRef}
      className={["stacked-table", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
