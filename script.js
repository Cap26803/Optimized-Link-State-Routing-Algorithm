document.addEventListener("DOMContentLoaded", function () {
    const numNodesInput = document.getElementById("numNodes");
    const sourceNodeInput = document.getElementById("sourceNode");
    const visualizeButton = document.getElementById("visualizeButton");
    const networkContainer = document.getElementById("network-container");

    visualizeButton.addEventListener("click", function () {
        const numNodes = parseInt(numNodesInput.value);
        const sourceNode = parseInt(sourceNodeInput.value);

        visualizeNetwork(numNodes, sourceNode);
    });

    function visualizeNetwork(numNodes, sourceNode) {
        const nodes = d3.range(1, numNodes + 1).map(id => ({ id }));
        const links = generateLinks(nodes);

        const width = 800;
        const height = 400;

        const svg = d3.select("#network-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", "#998")
            .style("stroke-width", 2);

        const node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 15)
            .attr("fill", d => (d.id === sourceNode) ? "red" : "steelblue")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const nodeText = svg.selectAll(".nodeText")
            .data(nodes)
            .enter().append("text")
            .attr("class", "nodeText")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em");

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            nodeText.attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        function generateLinks(nodes) {
            const links = [];
            for (let i = 1; i < nodes.length; i++) {
                links.push({ source: nodes[0], target: nodes[i] });
            }
            return links;
        }
    }
});