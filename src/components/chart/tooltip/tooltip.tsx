import * as React from "react";
import './tooltip.css';


export const TooltipTemplate = (info: {
  point: {
    value: React.ReactNode;
    data: {
             Date: {
               toLocaleString: (arg0: string, arg1: { year: string; month: string; day: string; }) => React.ReactNode;
             };
    };
  };
}) => {
  return (
    <div className="state-tooltip tooltip">
      <span>{info.point.value}</span>
      <span>
        {info.point.data.Date.toLocaleString(
          'en-US',
          { year: 'numeric', month: '2-digit', day: '2-digit' }
        )}
      </span>
    </div>
  );
}
