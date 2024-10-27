import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Controls = () => {
	const router = useRouter();

	const handleClearFilters = () => {
		if (typeof window !== "undefined") {
			Cookies.remove("filters");
		}

		toast.success("Filters cleared");

		router.push("/");
	};

	const handleShareFilters = () => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => {
				toast.success("Link copied to clipboard");
			})
			.catch(() => {
				toast.error("Failed to copy link to clipboard");
			});
	};

	return (
		<div className="col-span-12 row-span-12 h-full rounded-lg bg-white p-4 shadow-lg md:col-span-6">
			<button
				className="flex w-full items-center justify-center rounded-lg bg-gray-600 px-4 py-2 text-white"
				onClick={handleClearFilters}>
				Clear Filters
			</button>
			<button
				className="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white"
				onClick={handleShareFilters}>
				Share Filters
			</button>
		</div>
	);
};

export default Controls;
