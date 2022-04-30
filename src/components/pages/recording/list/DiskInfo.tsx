import {gql, useQuery} from "@apollo/client";
import {DiskInfo as DiskInfoModel} from "@/Model";
import {Box, Typography} from "@mui/material";
import {amber, blue, deepOrange, lightBlue, orange} from '@mui/material/colors'
import './DiskInfo.scss';
import prettyBytes from "pretty-bytes";
import React from "react";
import {QuestionMark} from "@mui/icons-material";
import {Cell, Label, Pie, PieChart} from "recharts";
import {isString} from "@/utils/TypeUtil";

const FETCH_DISK_INFO = gql`
    query FetchDiskInfo {
        diskInfo {
            totalBytes
            usableBytes
        }
    }
`;

/**
 * チャートデータの値の型
 */
export interface ChartValueType {
  /** 名称 */
  name: string;

  /** 容量 */
  value: number;

  /** 色 */
  color: string | ((chartData: ChartDataType) => string);

  /** 追加情報 */
  appendix?: React.ReactNode;
}

/**
 * チャートデータ型
 */
export interface ChartDataType {
  used: ChartValueType;
  free: ChartValueType;
  [key: string]: ChartValueType;
}

/**
 * 使用量の色を計算します
 *
 * @param chartData チャートデータ
 */
function buildUsedColor(chartData: ChartDataType): string {
  const total = Object.values(chartData).map(cd => cd.value).reduce((prev, cur) => prev + cur, 0);
  const used = chartData.used.value / total * 100;
  if (used < 70) {
    // @ts-ignore
    return blue[Math.floor(5 + used / 70 * 4) * 100];
  } else if (70 <= used && used < 80) {
    // @ts-ignore
    return amber[Math.floor(5 + (used - 70) / 10 * 4) * 100];
  } else if (80 <= used && used < 90) {
    // @ts-ignore
    return orange[Math.floor(5 + (used - 80) / 10 * 4) * 100];
  } else {
    // @ts-ignore
    return deepOrange[Math.floor(5 + (used - 90) / 10 * 4) * 100];
  }
}

/**
 * DiskInfo のパラメータ
 */
export interface DiskInfoProp {
  /**
   * チャートのデータを改変する関数
   *
   * @param chartData チャートのデータ
   */
  modifyChartData?: (chartData: ChartDataType) => ChartDataType;
}

export default function DiskInfo({modifyChartData}: DiskInfoProp) {
  const { error, data } = useQuery<{diskInfo: DiskInfoModel}>(FETCH_DISK_INFO, {
    fetchPolicy: 'no-cache'
  });
  const diskInfo = data?.diskInfo ?? { totalBytes: 0, usableBytes: 0 };
  let chartData: ChartDataType = {
    used: {
      name: '使用',
      value: diskInfo.totalBytes - diskInfo.usableBytes,
      color: buildUsedColor,
    },
    free: {
      name: '空き',
      value: diskInfo.usableBytes,
      color: lightBlue[500],
    }
  };

  if(modifyChartData) {
    chartData = modifyChartData({...chartData});
  }

  if(error) {
    return (
      <Box className="disk-info error">
        <QuestionMark />
      </Box>
    );
  }

  const chartDataValues = Object.values(chartData);
  const total = Object.values(chartData).map(cd => cd.value).reduce((prev, cur) => prev + cur, 0);
  const used = chartData.used.value / total * 100;

  return (
    <Box className="disk-info">
      <PieChart width={70} height={70}>
        <Pie
          data={chartDataValues.map(cd => ({name: cd.name, value: cd.value}))}
          dataKey="value"
          cx="50%"
          cy="50%"
          startAngle={360}
          endAngle={0}
          innerRadius={28}
          outerRadius={35}
          paddingAngle={1}
          isAnimationActive={false}
        >
          {chartDataValues.map(cd => (
            <Cell
              key={cd.name}
              fill={isString(cd.color) ? cd.color : cd.color(chartData)}
            />
          ))}
          <Label
            value="Disk"
            position="center"
            style={{
              fontFamily: "'Titillium Web', sans-serif",
              fontSize: '15px',
              fontWeight: '300',
              transform: 'translateY(10px)'
            }}
          />
          <Label
            value={`${Math.round(used)}%`}
            position="center"
            style={{
              fontFamily: "'Titillium Web', sans-serif",
              fontSize: '17px',
              fontWeight: '500',
              transform: 'translateY(-7px)'
            }}
          />
        </Pie>
      </PieChart>
      <table className="legend">
        <tbody>
          {chartDataValues.map(cd => (
            <Typography key={cd.name} component="tr" variant="body2">
              <td className="box">
                <span style={{
                  backgroundColor: isString(cd.color) ? cd.color : cd.color(chartData),
                }}></span>
              </td>
              <td className="label">{ cd.name }</td>
              <td className="value">{ prettyBytes(cd.value) }</td>
              <td className="appendix">{ cd.appendix }</td>
            </Typography>
          ))}
        </tbody>
      </table>
    </Box>
  )
}
