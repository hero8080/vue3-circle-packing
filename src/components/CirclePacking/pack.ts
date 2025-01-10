import * as d3Hierarchy from 'd3-hierarchy';

export function pack(data: any[]): any[] {
  const packLayout = (data) =>
    d3Hierarchy.pack().size([1,1]).padding(0)(
      d3Hierarchy
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.depth - a.depth)
    );

  const root = packLayout(data);
  console.log(root)
}
