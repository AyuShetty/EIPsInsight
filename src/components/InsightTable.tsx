import {Box, Text, useColorModeValue, Wrap, WrapItem, Badge, Link, Button} from "@chakra-ui/react";
import { CCardBody, CSmartTable } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";

const statusArr = ['Final', 'Draft', 'Review', 'Last_Call', 'Stagnant', 'Withdrawn', 'Living']

interface StatusChange {
    _id: string;
    eip: string;
    fromStatus: string;
    toStatus: string;
    title: string;
    status: string;
    author: string;
    created: string;
    changeDate: string;
    type: string;
    category: string;
    discussion: string;
    deadline: string;
    requires: string;
    pr: number;
    changedDay: number;
    changedMonth: number;
    changedYear: number;
    createdMonth: number;
    createdYear: number;
    __v: number;
  }
  
  interface DataObject {
    _id: string;
    count: number;
    statusChanges: StatusChange[];
  }

import '@coreui/coreui/dist/css/coreui.min.css';
import LoaderComponent from "./Loader";
import {DownloadIcon} from "@chakra-ui/icons";
interface TabProps {
    month : string;
    year : string;
    status: string;
  }
  const getStatus = (status: string) => {
    switch (status) {
      case "LastCall":
        return "Last Call";
      default:
        return status;
    }
  };

  interface FilteredDataItem {
    sr: number;
    eip: string;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    pr: number; // Change the type to number
    deadline?: string;
    created?: string;
    changeDate?: string;
  }

const InsightTable: React.FC<TabProps> = ({month , year, status})  => {
  const [data, setData] = useState<DataObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredData, setFilteredData] = useState<FilteredDataItem[]>([]);

  const factorAuthor = (data: any) => {
    let list = data.split(',');
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ');
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop();
    }
    return list;
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/statusChanges/${year}/${month}`);
            const jsonData = await response.json();
            setData(jsonData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [year, month]);

  useEffect(()=> {
    if(bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
        setIsDarkMode(true);
    }
  })
  
 
  const finalObject = data.find(item => item._id === getStatus(status));
  const finalStatusChanges = finalObject ? finalObject.statusChanges : [];


  useEffect(() => {
    const finalObject = data.find((item) => item._id === getStatus(status));
    const finalStatusChanges = finalObject ? finalObject.statusChanges : [];
  
    // Define a variable for the filtered data
    let newData: FilteredDataItem[] = [];
  
    if (status === "LastCall" || status === "Draft" || status === "Final") {
      let srNo = 1; // Initialize the serial number
  
      newData = finalStatusChanges.map((item: StatusChange) => {
        const {
          eip,
          title,
          author,
          status,
          type,
          category,
          pr,
          deadline,
          created,
          changeDate,
        } = item;
  
        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          pr,
          deadline,
          created,
          changeDate,
        };
      });
    } else {
      // Handle other cases here if needed
      newData = finalStatusChanges.map((item: StatusChange) => {
        const { eip, title, author, status, type, category, pr } = item;
  
        let srNo = 1; // Initialize the serial number
  
        return {
          sr: srNo++, // Add the serial number and increment it
          eip,
          title,
          author,
          status,
          type,
          category,
          pr,
        };
      });
    }
  
    // Update the state with the new data
    setFilteredData(newData);
  }, [data, status]);
  

  const bg = useColorModeValue("#f6f6f7", "#171923");

    const convertAndDownloadCSV = () => {
        if (filteredData && filteredData.length > 0) {
            // Create CSV headers
            const headers = Object.keys(filteredData[0]).join(',') + '\n';

            // Convert data to CSV rows
            const csvRows = filteredData.map((item) =>
                Object.values(item)
                    .map((value) => (typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value))
                    .join(',')
            );

            // Combine headers and rows
            const csvContent = headers + csvRows.join('\n');

            // Trigger CSV download
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${status}_${month}_${year}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

  return (
    <Box
    bgColor={bg}
    marginTop={"12"}
    p="1rem 1rem"
    borderRadius="0.55rem"
    _hover={{
      border: "1px",
      borderColor: "#30A0E0",
    }}
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 } as any}
    className=" ease-in duration-200"
  >

      <CCardBody
        style={{
          fontSize: '13px',
        }}
        className="scrollbarDesign"
      >
        {isLoading ? ( // Show loader while data is loading
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
           <LoaderComponent/>
          </Box>
        ) : (
            <>
                <Box>
                    <Button colorScheme="blue" variant="outline" fontSize={'14px'} fontWeight={'bold'} padding={'10px 20px'} onClick={convertAndDownloadCSV}>
                        <DownloadIcon marginEnd={'1.5'}/>
                        Download Reports
                    </Button>
                </Box>
            <CSmartTable
            items={filteredData.sort((a, b) => a.sr - b.sr)}
          activePage={1}
          clickableRows
          columnFilter
          columnSorter
          itemsPerPage={7}
          pagination
          tableProps={{
              hover: true,
              responsive: true,
          }}
          scopedColumns={{
            sr: (item: any) => (
              <td key={item.eip}>
                  <Link href={`/EIPS/${item.eip}`}>
                      <Wrap>
                          <WrapItem>
                              <Badge colorScheme={getStatusColor(item.status)}>{item.sr}</Badge>
                          </WrapItem>
                      </Wrap>
                  </Link>
              </td>
          ),
              eip: (item: any) => (
                  <td key={item.eip}>
                      <Link href={`/EIPS/${item.eip}`}>
                          <Wrap>
                              <WrapItem>
                                  <Badge colorScheme={getStatusColor(item.status)}>{item.eip}</Badge>
                              </WrapItem>
                          </Wrap>
                      </Link>
                  </td>
              ),
              title: (item: any) => (
                  <td key={item.eip} style={{ fontWeight: 'bold', height: '100%' }} className="hover:text-[#1c7ed6]">
                      <Link href={`/EIPS/${item.eip}`} className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
                          {item.title}
                      </Link>
                  </td>
              ),
              author: (it: any) => (
                  <td key={it.author}>
                      <div>
                          {factorAuthor(it.author).map((item: any, index: any) => {
                              let t = item[item.length - 1].substring(1, item[item.length - 1].length - 1);
                              return (
                                  <Wrap key={index}>
                                      <WrapItem>
                                          <Link href={`${
                                              item[item.length - 1].substring(item[item.length - 1].length - 1) ===
                                              '>'
                                                  ? 'mailto:' + t
                                                  : 'https://github.com/' + t.substring(1)
                                          }`} target="_blank" className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
                                              {item}
                                          </Link>
                                      </WrapItem>
                                  </Wrap>
                              );
                          })}
                      </div>
                  </td>
              ),
              type: (item: any) => (
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                      {item.type}
                  </td>
              ),
              category: (item: any) => (
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                      {item.category}
                  </td>
              ),
              status: (item: any) => (
                  <td key={item.eip}>
                      <Wrap>
                          <WrapItem>
                              <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
                          </WrapItem>
                      </Wrap>
                  </td>
              ),
              pr: (item: any) => (
                  <td key={item.eip}>
                      <Link href={`/PR/${item.pr}`}>
                          <Wrap>
                              <WrapItem>
                                  <Badge colorScheme={getStatusColor(item.status)}>{item.pr}</Badge>
                              </WrapItem>
                          </Wrap>
                      </Link>
                  </td>
              ),
              deadline: (item: any) => (

                    <td key={item.eip}>
                      <Wrap>
                        <WrapItem>
                          <Badge colorScheme={getStatusColor(item.status)}>{item.deadline}</Badge>
                        </WrapItem>
                      </Wrap>
                    </td>
                  ),
              created: (item: any) => (
                <td key={item.eip}>
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme={getStatusColor(item.status)}>{item.created.substring(0, 10)}</Badge>
                    </WrapItem>
                  </Wrap>
                </td>
              ),
              changeDate: (item: any) => (
                <td key={item.eip}>
                  <Wrap>
                    <WrapItem>
                      <Badge colorScheme={getStatusColor(item.status)}>{item.changeDate.substring(0, 10)}</Badge>
                    </WrapItem>
                  </Wrap>
                </td>
              ),
          

          }}
          
      />
            </>
        )}
      </CCardBody>
    </Box>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Living":
      return "blue";
    case "Final":
      return "blue";
    case "Stagnant":
      return "purple";
    case "Draft":
      return "orange"
    case "Withdrawn":
      return "red"
    case "Last Call":
      return "yellow"
    default:
      return "gray";
  }
};

export default InsightTable;
