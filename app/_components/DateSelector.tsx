"use client";

import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import { DateRangePicker } from "react-bootstrap-daterangepicker";

import React from "react";
import { DefaultFilter, useFilters } from "../_context/filterContext";

const DateSelector = ({
	setqueryData,
	queryData,
}: {
	setqueryData: React.Dispatch<React.SetStateAction<DefaultFilter | null>>;
	queryData: DefaultFilter | null;
}) => {
	const { filter } = useFilters();

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.split(" ");
		let [start, end] = [value[0], value[3]];

		start = start.split("/").reverse().join("-");
		end = end.split("/").reverse().join("-");

		setqueryData({
			...queryData,
			start: new Date(start),
			end: new Date(end),
		} as DefaultFilter);
	};

	return (
		<div className="w-[60%]">
			{filter && (
				<DateRangePicker
					key={
						filter.start?.toISOString() + filter.end?.toISOString()
					}
					onApply={handleDateChange}
					initialSettings={{
						timePicker: true,
						startDate: filter?.start,
						endDate: filter?.end,
						locale: {
							format: "DD/MM/YYYY HH:mm:ss",
						},
						ranges: {
							Today: [moment().toDate(), moment().toDate()],
							Yesterday: [moment().toDate(), moment().toDate()],
							"Last 7 Days": [
								moment().subtract(6, "days").toDate(),
								moment().toDate(),
							],
							"Last 30 Days": [
								moment().subtract(29, "days").toDate(),
								moment().toDate(),
							],
							"This Month": [
								moment().startOf("month").toDate(),
								moment().endOf("month").toDate(),
							],
						},
						opens: "left",
						drops: "up",
					}}>
					<input
						type="text"
						className="form-control col-4"
						name="date"
					/>
				</DateRangePicker>
			)}
		</div>
	);
};

export default DateSelector;
