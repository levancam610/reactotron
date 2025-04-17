import JsonView from '@uiw/react-json-view/esm/index';
import { Button, Card, Collapse, Table as DataTable, Flex, Input, Typography } from "antd/dist/antd.js";
import React, { useContext, useState } from "react";
import { FaCheck, FaCopy, FaTrashAlt } from "react-icons/fa";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels/dist/react-resizable-panels.esm.js";
import { CommandType } from "reactotron-core-contract";
import { filterCommands, ReactotronContext } from "reactotron-core-ui";
import styled from "styled-components";

import "./network.module.css";

const Container = styled.div`
  width: 100%;
  background-color: rgb(233, 233, 233);
  padding: 16px;
`
const isValidJsonObject = (data: any) => {
 return typeof data === 'object' && data != null;
}

const parseJson = (data: any) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  }
  return data
}

const JsonViewCustom = ({data}) => {
    console.log("data", data)
  return <JsonView displayDataTypes={false} shortenTextAfterLength={100} value={typeof data === "string" ? JSON.parse(data) : data} />
}

export function formatOperationName(requestData: string): string {
  try {
    const parsedData = JSON.parse(requestData)
    return parsedData?.operationName?.toString() || ""
  } catch (_err) {
    return ""
  }
}

  // Calculate request and response sizes
  const getRequestSize = (command: any): string => {
    const data = command?.payload?.request?.data;
    const bytes = data ? Buffer.from(JSON.stringify(data)).length : 0;
    
    // Format size with appropriate units (B, KB, MB)
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  };
  
  const getResponseSize = (command: any): string => {
    const contentLength = command?.payload?.response?.headers?.["Content-Length"];
    const bytes = parseInt(contentLength || "0", 10);
    
    // Format size with appropriate units (B, KB, MB)
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  };

const DUMMY_COMMANDS = [
  {
      "type": "api.response",
      "important": false,
      "payload": {
          "request": {
              "url": "https://api.monify.site/v1/graphql",
              "method": "POST",
              "data": "{\"query\":\"\\n      mutation InsertUserDeviceInfo($object: user_devices_insert_input!, $on_conflict: user_devices_on_conflict) {\\n        insert_user_devices_one(object: $object, on_conflict: $on_conflict) {\\n          id\\n        }\\n      }\\n    \",\"variables\":{\"object\":{\"device_id\":\"EA432F56-8B85-4843-B9D6-DF8755F05D55\",\"platform\":\"ios\",\"os_version\":\"18.2\",\"user_id\":\"558daab7-d347-4101-beff-64daca6630d0\",\"app_version\":\"1.0.0\",\"runtime_version\":\"1.0.0\",\"device_name\":\"iPhone\",\"first_install_time\":\"2025-02-25T18:32:05.550Z\",\"updated_at\":\"2025-04-15T17:15:47.399Z\",\"device_info\":{\"brand\":\"Apple\",\"type\":\"Handset\",\"fontScale\":1,\"lastUpdateTime\":-1,\"systemVersion\":\"18.2\",\"version\":\"1.0\",\"ipAddress\":\"192.168.3.107\"}},\"on_conflict\":{\"constraint\":\"user_devices_device_id_key\",\"update_columns\":[\"updated_at\",\"os_version\",\"app_version\",\"runtime_version\",\"device_info\"]}}}",
              "headers": {
                  "accept": "application/json, text/plain, */*",
                  "content-type": "application/json;charset=utf-8",
                  "x-hasura-admin-secret": "MJrv1FP5BqLlfe21fyA7OIp7xbuz7SpDjysmRGkgG1CuigDy1iTh5dw9PMFoDD2q"
              },
              "params": null
          },
          "response": {
              "body": {
                  "success": true,
                  "result": {
                      "insert_user_devices_one": {
                          "id": "c3bc7141-6259-4bae-9f90-9078878661b8"
                      }
                  }
              },
              "status": 200,
              "headers": {
                  "Date": "Tue, 15 Apr 2025 17:15:47 GMT",
                  "Content-Type": "application/json;charset=utf-8",
                  "Content-Length": "99",
                  "Server": "nginx/1.14.1",
                  "Connection": "keep-alive"
              }
          },
          "duration": 204.07483303546906
      },
      "connectionId": 0,
      "messageId": 33,
      "date": "2025-04-15T17:15:47.603Z",
      "deltaTime": 184,
      "clientId": "React Native App-ios-18.2-iOS-440-956-3"
  },
  {
      "type": "api.response",
      "important": true,
      "payload": {
          "request": {
              "url": "https://exp.host/--/api/v2/push/getExpoPushToken",
              "method": "POST",
              "data": "{\"type\":\"apns\",\"deviceId\":\"aa8b6256-8be8-4ebe-b5b2-db5026e58283\",\"development\":false,\"appId\":\"com.monify.ios\",\"deviceToken\":\"80c683e2166e7ece0adb9fd21b264a06d346967b7415a139099ecd7d69e29a38f56211d561bf75955dbb64af9081cec4703aeecd8635a9f7698197deec763aa978a6d8d5b611d9a899f3167025645aec\",\"projectId\":\"687478cc-a5f8-4e53-a9e8-5d348b0af6b0\"}",
              "headers": {
                  "content-type": "application/json"
              },
              "params": null
          },
          "response": {
              "body": {
                  "errors": [
                      {
                          "code": "EXPERIENCE_NOT_FOUND",
                          "type": "USER",
                          "message": "Experience with id '687478cc-a5f8-4e53-a9e8-5d348b0af6b0' does not exist.",
                          "isTransient": false,
                          "requestId": "20c21fb4-7e77-4329-90bd-3e4705f23205",
                          "metadata": {
                              "id": "687478cc-a5f8-4e53-a9e8-5d348b0af6b0"
                          }
                      }
                  ]
              },
              "status": 400,
              "headers": {
                  "x-content-type-options": "nosniff",
                  "Content-Type": "application/json; charset=utf-8",
                  "content-security-policy": "default-src 'none'",
                  "Via": "1.1 google",
                  "Date": "Tue, 15 Apr 2025 17:15:46 GMT",
                  "x-frame-options": "SAMEORIGIN",
                  "Vary": "Accept-Encoding, Origin",
                  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
                  "Content-Length": "272",
                  "Alt-Svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000"
              }
          },
          "duration": 474.18129193782806
      },
      "connectionId": 0,
      "messageId": 21,
      "date": "2025-04-15T17:15:47.097Z",
      "deltaTime": 55,
      "clientId": "React Native App-ios-18.2-iOS-440-956-3"
  },
]
const DEFAULT_PANEL_SIZE = [70, 30]
const PAGE_WIDTH = window.innerWidth - 115;
// const commands = DUMMY_COMMANDS;
const Network = () => {
  const { clearCommands, commands } = useContext(ReactotronContext)
//   console.log("commands", commands);
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  let filteredCommands;
  try {
    filteredCommands = filterCommands(commands, searchText, []).filter((command)=>command.type === CommandType.ApiResponse)
  } catch (error) {
    console.error(error)
    filteredCommands = commands
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  const handleClear = () => {
    setSearchText("");
    setSelectedRowKey(null);
    clearCommands();
  };
  
  // Transform commands into table data format

  const columns = [
    {
      dataIndex: "date",
      title: "Request Time",
      width: 100,
      render: (date) => new Date(date).toLocaleTimeString(),
      fixed: 'left',
    },
    {
      dataIndex: ["payload", "request", "url"],
      title: "Request",
      ellipsis: true,
      fixed: 'left',
    },
    {
      dataIndex: ["payload", "request", "method"],
      title: "Method",
      width: 70,
    },
    {
      dataIndex: ["payload", "response", "status"],
      title: "Status",
      width: 80,
      render: (status) => (
        <span style={{ 
          color: status >= 200 && status < 300 ? 'green' : 
                 status >= 400 ? 'red' : 'orange' 
        }}>
          {status}
        </span>
      )
    },
    {
      title: "Request Size",
      width: 100,
      render: (_, record) => getRequestSize(record),
    },
    {
      title: "Response Size",
      width: 110,
      render: (_, record) => getResponseSize(record),
    },
    {
      dataIndex: ["payload", "duration"],
      title: "Time",
      width: 100,
      render: (duration) => `${Math.round(duration)} ms`,
      fixed: 'right',
    },
  ]

  const selectedRequest = selectedRowKey !== null 
    ? filteredCommands.find(item => item.messageId === selectedRowKey) 
    : null;
    console.log("selectedRequest", selectedRowKey, selectedRequest)
    const [panelSizes, setPanelSizes] = useState(DEFAULT_PANEL_SIZE)
    
    const onLayout = (sizes) => {
      setPanelSizes(sizes)
    }
    const [copiedKey, setCopiedKey] = useState<string>("");

    const copyToClipboard = (data: any, key: string) => {
      navigator.clipboard.writeText(JSON.stringify(data));
      setCopiedKey(key);
    };

  return (
    <Container>
      <PanelGroup maxWidth="100%" direction="horizontal" id="group" onLayout={onLayout}>
        <Panel style={{width: `${PAGE_WIDTH*(panelSizes[0]/100)}px`}} id="left" defaultSize={DEFAULT_PANEL_SIZE[0]} minSize={20}>
          <Flex gap={10} style={{marginBottom: 6}}>
            <Input.Search
                placeholder="Search requests..."
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
            <Button icon={<FaTrashAlt />} onClick={handleClear} /> 
          </Flex>
          <Card bodyStyle={{padding: 0, paddingBottom: 10, overflowX: "auto"}} style={{minHeight: "100%"}} size="small">
            <DataTable
                dataSource={filteredCommands.reverse()}
                columns={columns}
                size="small"
                pagination={false}
                rowKey="messageId"
                rowClassName={(record) => record.messageId === selectedRowKey ? 'ant-table-row-selected' : ''}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedRowKey(record.messageId);
                  },
                  style: { cursor: 'pointer' }
                })}
                scroll={{ y: "calc(100vh - 130px)" }}
                style={{ width: `${PAGE_WIDTH*(panelSizes[0]/100)}px`, height: "100%", minHeight: "100%" }}
            />
        </Card>
        </Panel>
        <PanelResizeHandle style={{width: 12}} />
        <Panel id="right" defaultSize={DEFAULT_PANEL_SIZE[1]} style={{maxWidth: `${PAGE_WIDTH*(panelSizes[1]/100)}px`, overflow: "auto"}}>
          <Card size="small" bodyStyle={{padding: 0}}>
            {selectedRowKey !== null && selectedRequest ? (
              <Collapse
                size="small"
                defaultActiveKey={['response']}
                items={[
                  {
                    key: 'header',
                    label: <Typography.Text strong>Header</Typography.Text>,
                    children: (
                      <div style={{backgroundColor: "#fff"}}>
                          <Flex gap={4}>
                            <Button 
                                type="text" 
                                icon={copiedKey === selectedRequest.payload.request.url ? <FaCheck /> : <FaCopy />} 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(selectedRequest.payload.request.url, selectedRequest.payload.request.url);
                                }}
                              />
                              <div>
                                <Typography.Text strong>URL:</Typography.Text> {selectedRequest.payload.request.url}
                              </div>
                          </Flex>
                          {Object.entries(selectedRequest.payload.request.headers).map(([key, value]) => (
                          <Flex key={key} gap={4}>
                            <Button 
                              type="text" 
                              icon={copiedKey === String(value) ? <FaCheck /> : <FaCopy />} 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(String(value), String(value));
                              }}
                            />
                            <div>
                              <Typography.Text strong>{key}:</Typography.Text> {String(value)}
                            </div>
                            
                          </Flex>
                        ))}
                      </div>
                    ),
                    style: { backgroundColor: '#f0f0f0' }
                  },
                  {
                    key: 'request_params',
                    label: <Typography.Text strong>Request params</Typography.Text>,
                    children: (
                      <div style={{backgroundColor: "#fff"}}>                          
                        {isValidJsonObject(selectedRequest.payload.request.params) && (
                          <JsonViewCustom data={selectedRequest.payload.request.params} />
                        )}
                      </div>
                    ),
                    style: { backgroundColor: '#f0f0f0' }
                  },
                  {
                    key: 'request_body',
                    label: (
                      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Typography.Text strong>Request body</Typography.Text>
                        <Button 
                            type="text" 
                            icon={copiedKey === "request" ? <FaCheck /> : <FaCopy />} 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(selectedRequest.payload.request.data, "request");
                            }}
                          />
                      </Flex>
                    ),
                    children: (
                      <div style={{backgroundColor: "#fff"}}>                          
                        {isValidJsonObject(parseJson(selectedRequest.payload.request.data)) && (
                          <JsonViewCustom data={parseJson(selectedRequest.payload.request.data)} />
                        )}
                      </div>
                    ),
                    style: { backgroundColor: '#f0f0f0' }
                  },
                  {
                    key: 'response',
                    label: (
                      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Typography.Text strong>Response body</Typography.Text>
                        {typeof selectedRequest.payload.response.body === 'object' && (
                          <Button 
                            type="text" 
                            icon={copiedKey === "response" ? <FaCheck /> : <FaCopy />} 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(selectedRequest.payload.response.body, 'response');
                            }}
                          />
                        )}
                      </Flex>
                    ),
                    children: (
                      <div style={{backgroundColor: "#fff"}}>
                       {isValidJsonObject(selectedRequest.payload.response.body) ? (
                          <JsonViewCustom data={selectedRequest.payload.response.body} />
                        ) : (
                          <Typography.Text>Body data skipped or not available</Typography.Text>
                        )}
                      </div>
                    ),
                    style: { backgroundColor: '#f0f0f0' }
                  }
                ]}
              />
              ) : <div style={{padding: 10, height: "100%"}}><Typography.Text>Select a request to view details</Typography.Text></div>}
          </Card>
        </Panel>
      </PanelGroup>
    </Container>
  );
}
export default Network;