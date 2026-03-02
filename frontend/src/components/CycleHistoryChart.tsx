import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Cycle } from '@/store';
import { differenceInCalendarDays, format } from 'date-fns';

interface CycleChartProps {
    cycles: Cycle[];
}

export const CycleHistoryChart = ({ cycles }: CycleChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!cycles || cycles.length <= 1 || !svgRef.current) return;

        // Process data for the chart
        // We need the start date and the length of the cycle
        // A cycle length is the difference between its start date and the next cycle's start date

        // Sort cycles chronologically for graphing
        const sortedCycles = [...cycles].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

        const data = sortedCycles.map((cycle, index) => {
            const isLastAndIncomplete = index === sortedCycles.length - 1 && !cycle.end_date;
            return {
                date: new Date(cycle.start_date),
                length: differenceInCalendarDays(
                    new Date(cycle.end_date || new Date()),
                    new Date(cycle.start_date)
                ),
                label: format(new Date(cycle.start_date), 'MMM d'),
                isIncomplete: isLastAndIncomplete
            };
        });

        if (data.length === 0) return;

        // Setup dimensions
        const width = 300;
        const height = 180;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Create new chart ...
        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scalePoint()
            .domain(data.map(d => d.label))
            .range([0, innerWidth])
            .padding(0.5);

        // Find min and max for somewhat dynamic Y scaling with padding
        const minLength = d3.min(data, d => d.length) || 3;
        const maxLength = d3.max(data, d => d.length) || 7;

        const yScale = d3.scaleLinear()
            .domain([Math.max(0, minLength - 2), maxLength + 2])
            .range([innerHeight, 0]);

        // Line generator
        const line = d3.line<any>()
            .x(d => xScale(d.label) as number)
            .y(d => yScale(d.length))
            .curve(d3.curveMonotoneX); // Smooth curve

        // Add Grid lines
        const yAxisGrid = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
            .ticks(5);

        svg.append("g")
            .attr("class", "grid")
            .call(yAxisGrid)
            .style("stroke", "var(--color-slate)")
            .style("stroke-opacity", "0.1")
            .style("stroke-dasharray", "3,3")
            .select(".domain").remove();

        // Add X Axis
        svg.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .select(".domain").remove(); // Remove axis baseline

        svg.selectAll(".tick line").remove(); // Remove tick marks
        svg.selectAll(".tick text")
            .style("fill", "var(--color-slate)")
            .style("font-family", "inherit")
            .style("font-size", "10px")
            .style("opacity", "0.6");

        // Add Y Axis
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .select(".domain").remove();

        svg.selectAll(".tick line").remove();
        svg.selectAll(".tick text")
            .style("fill", "var(--color-slate)")
            .style("font-family", "inherit")
            .style("font-size", "10px")
            .style("opacity", "0.6");

        const isLastIncomplete = data.length > 0 && data[data.length - 1].isIncomplete;
        const completeData = isLastIncomplete ? data.slice(0, -1) : data;
        const incompleteData = isLastIncomplete ? data.slice(-2) : [];

        // Add the path for complete data
        if (completeData.length > 0) {
            const path1 = svg.append("path")
                .datum(completeData)
                .attr("fill", "none")
                .attr("stroke", "var(--color-terracotta)")
                .attr("stroke-width", 3)
                .attr("d", line);

            const totalLength1 = (path1.node() as SVGPathElement).getTotalLength();

            path1
                .attr("stroke-dasharray", totalLength1 + " " + totalLength1)
                .attr("stroke-dashoffset", totalLength1)
                .transition()
                .duration(isLastIncomplete ? 1200 : 1500)
                .ease(d3.easeCubicOut)
                .attr("stroke-dashoffset", 0);
        }

        // Add the path for incomplete data (dashed)
        if (incompleteData.length > 1) {
            const path2 = svg.append("path")
                .datum(incompleteData)
                .attr("fill", "none")
                .attr("stroke", "var(--color-terracotta)")
                .attr("stroke-width", 3)
                .attr("d", line)
                .style("stroke-dasharray", "6,6");

            // Simple opacity animation for the dashed part
            path2
                .attr("opacity", 0)
                .transition()
                .delay(1200)
                .duration(300)
                .attr("opacity", 1);
        }

        // Add dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", d => d.isIncomplete ? "dot incomplete" : "dot")
            .attr("cx", d => xScale(d.label) as number)
            .attr("cy", d => yScale(d.length))
            .attr("r", 0) // Start with radius 0 for animation
            .attr("fill", d => d.isIncomplete ? "white" : "white")
            .attr("stroke", "var(--color-terracotta)")
            .attr("stroke-width", 2)
            .transition()
            .delay((_, i) => i * (1500 / data.length) + 100) // Staggered appearance
            .duration(500)
            .attr("r", 4);

    }, [cycles]);

    if (!cycles || cycles.length <= 1) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full text-center">
                <p className="text-sm text-[var(--color-slate)]/60 font-medium">Not enough data to graph.</p>
                <p className="text-xs text-[var(--color-slate)]/40 mt-1">Log at least 2 cycles to see trends.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <svg ref={svgRef} className="w-full h-full" style={{ overflow: 'visible' }}></svg>
        </div>
    );
};
