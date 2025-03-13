import * as d3 from "d3";
import {deserialize} from "@ungap/structured-clone";
import {Graph} from "../shared/graph/Graph";

(async () => {
    const root = document.getElementById("root")!;

    const apiResponse = await(await fetch("/graph")).json();
    const graph = Graph.fromSerialized(deserialize(apiResponse));

    console.log(graph);

    // data.links = data.relations;
    // data.nodes = Object.values(data.nodes);
    //
    // const width = 928;
    // const height = 600;
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    //
    // const nodes = data.nodes.map(d => Object.create(d));
    // const index = new Map(nodes.map(d => [d.id, d]));
    // const links = data.links.map(d => Object.assign(Object.create(d), {
    //     source: index.get(d.from),
    //     target: index.get(d.to)
    // }));
    //
    // const simulation = d3.forceSimulation(nodes)
    //     .force("link", d3.forceLink(links).id(d => d.id))
    //     .force("charge", d3.forceManyBody())
    //     .force("center", d3.forceCenter(width / 2, height / 2))
    //     .on("tick", ticked);
    //
    // // Create the SVG container.
    // const svg = d3.create("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("viewBox", [0, 0, width, height])
    //     .attr("style", "max-width: 100%; height: auto;");
    //
    // // Add a line for each link, and a circle for each node.
    // const link = svg.append("g")
    //     .attr("stroke", "#999")
    //     .attr("stroke-opacity", 0.6)
    //     .selectAll()
    //     .data(links)
    //     .join("line")
    //     .attr("stroke-width", d => Math.sqrt(d.value));
    //
    // const node = svg.append("g")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 1.5)
    //     .selectAll()
    //     .data(nodes)
    //     .join("circle")
    //     .attr("r", 5)
    //     .attr("fill", d => color(d.group));
    //
    // node.append("title")
    //     .text(d => d.id);
    //
    // // Add a drag behavior.
    // node.call(d3.drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended));
    //
    // // Set the position attributes of links and nodes each time the simulation ticks.
    // function ticked() {
    //     link
    //         .attr("x1", d => d.source.x)
    //         .attr("y1", d => d.source.y)
    //         .attr("x2", d => d.target.x)
    //         .attr("y2", d => d.target.y);
    //
    //     node
    //         .attr("cx", d => d.x)
    //         .attr("cy", d => d.y);
    // }
    //
    // // Reheat the simulation when drag starts, and fix the subject position.
    // function dragstarted(event) {
    //     if (!event.active) simulation.alphaTarget(0.3).restart();
    //     event.subject.fx = event.subject.x;
    //     event.subject.fy = event.subject.y;
    // }
    //
    // // Update the subject (dragged node) position during drag.
    // function dragged(event) {
    //     event.subject.fx = event.x;
    //     event.subject.fy = event.y;
    // }
    //
    // // Restore the target alpha so the simulation cools after dragging ends.
    // // Unfix the subject position now that it’s no longer being dragged.
    // function dragended(event) {
    //     if (!event.active) simulation.alphaTarget(0);
    //     event.subject.fx = null;
    //     event.subject.fy = null;
    // }
    //
    // // When this cell is re-run, stop the previous simulation. (This doesn’t
    // // really matter since the target alpha is zero and the simulation will
    // // stop naturally, but it’s a good practice.)
    // // invalidation.then(() => simulation.stop());
    //
    // root.append(svg.node());
})();
