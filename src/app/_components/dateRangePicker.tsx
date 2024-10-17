import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import { DateRangePicker as Picker } from "react-bootstrap-daterangepicker";
import { useFilters } from "../context/filters";
import { min } from "date-fns";

interface DateRangePickerProps {
  queryData: {
    startDate: Date;
    endDate: Date;
    age: number;
    gender: string;
  };
  setqueryData: React.Dispatch<
    React.SetStateAction<{
      startDate: Date;
      endDate: Date;
      age: number;
      gender: string;
    }>
  >;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  queryData,
  setqueryData,
}) => {
  const { filters } = useFilters();

  const handleApply = (event: any, picker: any) => {
    const startDate = moment(picker.startDate._d).startOf("day").toDate();
    const endDate = moment(picker.endDate._d).startOf("day").toDate();

    setqueryData({
      ...queryData,
      startDate,
      endDate,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span>Date Range - </span>
        <div className="w-[60%]">
          <Picker
            onApply={handleApply}
            initialSettings={{
              timePicker: true,
              startDate: filters.startDate,
              endDate: filters.endDate,
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
              minDate: moment("2022-10-04").startOf("day").toDate(),
              maxDate: moment("2022-10-29").startOf("day").toDate(),
              opens: "left",
              drops: "up",
            }}
          >
            <input type="text" className="form-control col-4" />
          </Picker>
        </div>
      </div>
    </>
  );
};

export default DateRangePicker;
