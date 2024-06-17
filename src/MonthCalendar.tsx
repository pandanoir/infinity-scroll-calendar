import { type CSSProperties, useMemo } from "react";

const DateCell = ({
	date: dateObj,
	hovered,
	onHover,
	onLeave,
	style,
}: {
	date: Date;
	hovered: [number, number] | null;
	onHover: (yearmonth: [number, number]) => void;
	onLeave: (yearmonth: [number, number]) => void;
	style: CSSProperties;
}) => {
	const year = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1;
	const date = dateObj.getDate();
	return (
		<div
			style={{
				padding: "10px 20px",
				background:
					hovered?.[0] === year && hovered?.[1] === month
						? "#f9f9f9"
						: undefined,
				...style,
				color:
					dateObj.getDay() === 0
						? "#ED1A3D"
						: dateObj.getDay() === 6
							? "#21A0DB"
							: undefined,
				textAlign: "center",
			}}
			onMouseEnter={() => onHover([year, month])}
			onMouseLeave={() => onLeave([year, month])}
		>
			{date}
		</div>
	);
};
export const MonthCalendar = ({
	year,
	month, // 1 == jan
	hovered,
	onHover,
	onLeave,
}: {
	year: number;
	month: number;
	hovered: [number, number] | null;
	onHover: (yearmonth: [number, number]) => void;
	onLeave: (yearmonth: [number, number]) => void;
}) => {
	const prevMonthCalendar = useMemo(() => {
		const calendar: Date[] = [];
		const startOfMonth = new Date(year, month - 1, 1);
		for (let i = startOfMonth.getDay(); i > 0; --i) {
			calendar.push(new Date(year, month - 1, 1 - i));
		}
		return calendar;
	}, [month, year]);

	const calendar = useMemo(() => {
		const calendar: Date[] = [];
		const endDateOfMonth = new Date(year, month + 1 - 1, 0).getDate();
		for (let i = 1; i <= endDateOfMonth; i++) {
			calendar.push(new Date(year, month - 1, i));
		}
		return calendar.slice(
			0,
			calendar.length - ((prevMonthCalendar.length + calendar.length) % 7),
		);
	}, [month, prevMonthCalendar, year]);

	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
			{prevMonthCalendar.map((date) => (
				<DateCell
					date={date}
					style={{ borderBottom: "1px solid #888" }}
					hovered={hovered}
					onHover={onHover}
					onLeave={onLeave}
					key={date.getDate()}
				/>
			))}
			{calendar.map((date) => (
				<DateCell
					date={date}
					style={{
						borderLeft:
							date.getDate() === 1 && prevMonthCalendar.length > 0
								? "1px solid #888"
								: undefined,
						borderTop:
							date.getDate() <= 7 - prevMonthCalendar.length
								? "1px solid #888"
								: undefined,
					}}
					hovered={hovered}
					onHover={onHover}
					onLeave={onLeave}
					key={date.getDate()}
				/>
			))}
		</div>
	);
};
