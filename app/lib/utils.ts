import Cookies from "js-cookie";

export const setParams = (data: {
	date: string;
	age: string;
	gender: string;
}) => {
	const date = data.date.toString().split(" ");
	const start = date[0].split("/").reverse().join("-");
	const end = date[3].split("/").reverse().join("-");

	const params = new URLSearchParams();
	params.set("start", new Date(start).toISOString());
	params.set("end", new Date(end).toISOString());
	params.set("age", data.age.toString());
	params.set("gender", data.gender.toString());

	return params;
};

export const saveFilters = (data: {
	date: string;
	age: string;
	gender: string;
}) => {
	const date = data.date.toString().split(" ");
	const start = date[0].split("/").reverse().join("-");
	const end = date[3].split("/").reverse().join("-");

	Cookies.set(
		"filters",
		JSON.stringify({
			start: new Date(start),
			end: new Date(end),
			age: data.age,
			gender: data.gender,
		}),
		{
			expires: 7,
		}
	);
};
