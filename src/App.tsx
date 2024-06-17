import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MonthCalendar } from "./MonthCalendar";
import mergeRefs from "merge-refs";

const today = new Date();
const thisMonth = [today.getFullYear(), today.getMonth() + 1];

export const App = () => {
	const thisMonthRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!thisMonthRef.current) {
			return;
		}
		const y = thisMonthRef.current.getBoundingClientRect().y;
		requestAnimationFrame(() => {
			window.scrollTo(0, y);
		});
	}, []);
	const [size, setSize] = useState(13);
	const calendars = useMemo(
		() =>
			[...Array(size).keys()]
				.map(
					(i) =>
						new Date(
							thisMonth[0],
							thisMonth[1] - 1 + (i - Math.trunc(size / 2)),
							1,
						),
				)
				.map((startOfMonth) => [
					startOfMonth.getFullYear(),
					startOfMonth.getMonth() + 1,
				]),
		[size],
	);
	const onChange = (inView: boolean) => {
		if (!inView) {
			return;
		}
		setSize((size) => size + 2);
	};
	const { ref: inViewRefUpper } = useInView({ threshold: 1, onChange });
	const { ref: inViewRefLower } = useInView({ threshold: 1, onChange });

	const [hovered, setHovered] = useState<[number, number] | null>(null);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "max-content 1fr",
				width: 300,
			}}
		>
			{calendars.map(([year, month], i) => (
				<Fragment key={`${year}/${month}`}>
					<div
						style={{
							padding: "0 20px",
							placeContent: "center",
							height: "100%",
						}}
						ref={mergeRefs<HTMLDivElement>(
							year === thisMonth[0] && month === thisMonth[1]
								? thisMonthRef
								: undefined,
							i === 1
								? inViewRefUpper
								: i === size - 2
									? inViewRefLower
									: undefined,
						)}
					>
						{year}/{month}
					</div>
					<MonthCalendar
						year={year}
						month={month}
						hovered={hovered}
						onHover={setHovered}
						onLeave={() => setHovered(null)}
					/>
				</Fragment>
			))}
		</div>
	);
};
