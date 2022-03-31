import {gql, useQuery} from "@apollo/client";
import {DiskInfo as DiskInfoModel} from "@/Model";
import {Box, CircularProgress, Tooltip, Typography} from "@mui/material";
import { blue, amber, orange, deepOrange } from '@mui/material/colors'
import './DiskInfo.scss';
import prettyBytes from "pretty-bytes";
import React from "react";
import {QuestionMark} from "@mui/icons-material";

const FETCH_DISK_INFO = gql`
    query FetchDiskInfo {
        diskInfo {
            totalBytes
            usableBytes
        }
    }
`;

export default function DiskInfo() {
  const { loading, error, data } = useQuery<{diskInfo: DiskInfoModel}>(FETCH_DISK_INFO, {
    fetchPolicy: 'no-cache'
  });
  const diskInfo = data?.diskInfo ?? { totalBytes: 0, usableBytes: 0 };
  const used = (1 - diskInfo.usableBytes / diskInfo.totalBytes) * 100;
  const color = (() => {
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
  })();

  if(error) {
    return (
      <Box className="disk-info error">
        <QuestionMark />
      </Box>
    );
  }

  return (
    <Tooltip
      title={<React.Fragment>
        <Typography component="div" variant="caption">合計: {prettyBytes(diskInfo.totalBytes)}</Typography>
        <Typography component="div" variant="caption">空き: {prettyBytes(diskInfo.usableBytes)}</Typography>
      </React.Fragment>}
      arrow
    >
      <Box className="disk-info">
        <Box className="circle-container">
          <CircularProgress
            size={50}
            thickness={5}
            variant={loading ? 'indeterminate' : 'determinate'}
            value={used}
            sx={{ color }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ cursor: 'default' }}
            >{`${Math.round(used)}%`}</Typography>
          </Box>
        </Box>

        <Typography
          className="title"
          component="div"
          color="text.secondary"
          sx={{ cursor: 'default' }}
        >Disk</Typography>
      </Box>
    </Tooltip>
  )
}
