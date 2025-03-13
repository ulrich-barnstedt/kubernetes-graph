// @ts-nocheck - d3 does not cooperate with typescript

import {Graph} from "../shared/graph/Graph";
import structuredClone from "@ungap/structured-clone";
import * as d3 from "d3";

export const drawNetwork = (graph: Graph) => {
    const nodes = structuredClone(graph.getAllNodes());
    const index = new Map(nodes.map(d => [d.id, d]));
    const links = structuredClone(graph.getAllRelations()).map(relation => {
        return {
            source: index.get(relation.from.id),
            target: index.get(relation.to.id)
        }
    });

    const svg = d3.select("div#container")
        .append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("width", "100%")
        .attr("height", "100%");
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#222229")
    const svgGroup = svg
        .call(d3.zoom().on("zoom", function ({transform}) {
            svgGroup.attr("transform", transform)
        }))
        .append("svg:g");

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const link = svgGroup.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))
    const node = svgGroup.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.8)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 7)
        .attr("fill", d => color(d.kind));
    node.append("title")
        .text(d => d.id);

    d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(
            document.documentElement.scrollWidth / 2,
            document.documentElement.scrollHeight / 2
        ))
        .on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
}
