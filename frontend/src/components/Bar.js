import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateScatter } from "../redux/scatterSlice";
import { updateScrollPosition } from "../redux/scrollSlice";
import Plot from "react-plotly.js";

export default function Bar() {
    const categoryCount = useSelector((state) => state.scatter.categoryCount);
    const attackCategories = useSelector(
        (state) => state.scatter.attackCategories
    );
    const colors = useSelector((state) => state.scatter.colors);
    const containerRef = useRef(null);
    const scrollPosition =
        useSelector((state) => state.scroll.scrollPositions.bar) || 0;
    const storedScrollPosition = useRef(scrollPosition);
    const dispatch = useDispatch();

    const attackTypePlots = attackCategories.map((category, index) => (
        <Plot
            key={index}
            data={[
                {
                    x: Array.from({ length: 60 }, (_, i) => i + 1),
                    y: categoryCount[category],
                    type: "bar",
                    name: category,
                    marker: { color: colors[category] },
                },
            ]}
            layout={{
                xaxis: {
                    title: "Time (min)",
                    tickmode: "linear",
                    dtick: 1,
                    range: [1, 60],
                },
                yaxis: { title: "Traffic" },
                title: category,
            }}
            style={{
                width: "100%",
            }}
        />
    ));

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = (event) => {
            const scrollTop = event.target.scrollTop;
            storedScrollPosition.current = scrollTop;
            dispatch(updateScrollPosition(["bar", scrollTop]));
        };

        if (container) {
            if (storedScrollPosition.current !== 0) {
                container.scrollTop = storedScrollPosition.current;
            }
            container.addEventListener("scroll", handleScroll);
        }

        const fetchScatterData = () => {
            fetch("http://localhost:3001/get-scatterData", {
                method: "GET",
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    dispatch(updateScatter(data.scatterData));
                });
        };

        const scatterHandle = setInterval(fetchScatterData, 1000);
        return () => {
            clearInterval(scatterHandle);
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [dispatch]);

    return categoryCount ? (
        <div className="scatter" ref={containerRef}>
            <div className="titleHolder">
                <h1>Bar Graph</h1>
            </div>
            {categoryCount["attack"] && (
                <Plot
                    data={[
                        {
                            x: Array.from({ length: 60 }, (_, i) => i + 1),
                            y: categoryCount["BENIGN"],
                            type: "bar",
                            name: "Normal Traffic",
                            marker: { color: colors["BENIGN"] },
                        },
                        {
                            x: Array.from({ length: 60 }, (_, i) => i + 1),
                            y: categoryCount["attack"],
                            type: "bar",
                            name: "Attack Traffic",
                            marker: { color: colors["attack"] },
                        },
                    ]}
                    layout={{
                        xaxis: {
                            title: "Time (min)",
                            tickmode: "linear",
                            dtick: 1,
                            range: [1, 60],
                        },
                        yaxis: { title: "Traffic" },
                        title: "Bar Graph of Attack and Normal Data",
                    }}
                    style={{
                        width: "100%",
                    }}
                />
            )}
            {attackTypePlots && attackTypePlots}
        </div>
    ) : (
        <div className="loading">
            <h1>Creating Bar Graph</h1>
        </div>
    );
}
