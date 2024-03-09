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
        const nodes = d3.range(numNodes).map(id => ({ id }));
        const links = generateLinks(numNodes);

        const width = 800;
        const height = 400;

        const svg = d3.select("#network-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        const link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link");

        const node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .attr("fill", d => (d.id === sourceNode) ? "red" : "steelblue")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
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

        function generateLinks(numNodes) {
            const links = [];
            for (let i = 1; i < numNodes; i++) {
                links.push({ source: 0, target: i });
            }
            return links;
        }
    }
});
