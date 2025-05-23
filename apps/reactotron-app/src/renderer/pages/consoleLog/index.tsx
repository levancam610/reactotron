import { clipboard, shell } from "electron"
import fs from "fs"
import debounce from "lodash.debounce"
import os from "os"
import path from "path"
import React, { useCallback, useContext, useMemo } from "react"
import { FaTimes } from "react-icons/fa"
import {
  MdDeleteSweep,
  MdDownload,
  MdFilterList,
  MdReorder,
  MdSearch,
  MdSwapVert,
} from "react-icons/md"
import { CommandType } from "reactotron-core-contract"
import {
  EmptyState,
  Header,
  RandomJoke,
  ReactotronContext,
  TimelineContext,
  TimelineFilterModal,
  filterCommands,
  timelineCommandResolver,
} from "reactotron-core-ui"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TimelineContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
const HelpMessage = styled.div`
  margin: 0 40px;
`
const QuickStartButtonContainer = styled.div`
  display: flex;
  padding: 4px 8px;
  margin: 30px 20px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => props.theme.backgroundLighter};
  color: ${(props) => props.theme.foreground};
  align-items: center;
  justify-content: center;
  text-align: center;
`
const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.foregroundDark};
  margin: 40px 10px;
`

export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

function ConsoleLog() {
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const {
    isSearchOpen,
    toggleSearch,
    closeSearch,
    setSearch,
    search,
    isReversed,
    toggleReverse,
    openFilter,
    closeFilter,
    isFilterOpen,
    hiddenCommands,
    setHiddenCommands,
  } = useContext(TimelineContext)

  let filteredCommands
  try {
    filteredCommands = filterCommands(commands, search, hiddenCommands).filter((command)=>command.type === CommandType.Log)
  } catch (error) {
    console.error(error)
    filteredCommands = commands
  }

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  const dispatchAction = (action: any) => {
    sendCommand("state.action.dispatch", { action })
  }

  function openDocs() {
    shell.openExternal("https://docs.infinite.red/reactotron/quick-start/react-native/")
  }

  function downloadLog() {
    const homeDir = os.homedir()
    const downloadDir = path.join(homeDir, "Downloads")
    fs.writeFileSync(
      path.resolve(downloadDir, `timeline-log-${Date.now()}.json`),
      JSON.stringify(commands || []),
      "utf8"
    )
    console.log(`Exported timeline log to ${downloadDir}`)
  }

  const { searchString, handleInputChange } = useDebouncedSearchInput(search, setSearch, 300)
  return null;
  return (
    <Container>
      <Header
        title="Console Log"
        isDraggable
        actions={[
          {
            tip: "Export Log",
            icon: MdDownload,
            onClick: () => {
              downloadLog()
            },
          },
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              toggleSearch()
            },
          },
          {
            tip: "Filter",
            icon: MdFilterList,
            onClick: () => {
              openFilter()
            },
          },
          {
            tip: "Reverse Order",
            icon: MdSwapVert,
            onClick: () => {
              toggleReverse()
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearCommands()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput autoFocus value={searchString} onChange={handleInputChange} />
            <ButtonContainer
              onClick={() => {
                if (search === "") {
                  closeSearch()
                } else {
                  setSearch("")
                }
              }}
            >
              <FaTimes size={24} />
            </ButtonContainer>
          </SearchContainer>
        )}
      </Header>
      <TimelineContainer>
        {filteredCommands.length === 0 ? (
          <EmptyState icon={MdReorder} title="No Activity">
            <HelpMessage>
              Once your app connects and starts sending events, they will appear here.
            </HelpMessage>
            <QuickStartButtonContainer onClick={openDocs}>
              Check out the quick start guide here!
            </QuickStartButtonContainer>
            <Divider />
            <RandomJoke />
          </EmptyState>
        ) : (
          filteredCommands.map((command) => {
            const CommandComponent = timelineCommandResolver(command.type)

            if (CommandComponent) {
              return (
                <CommandComponent
                  key={command.messageId}
                  command={command}
                  copyToClipboard={clipboard.writeText}
                  readFile={(path) => {
                    return new Promise((resolve, reject) => {
                      fs.readFile(path, "utf-8", (err, data) => {
                        if (err || !data) reject(new Error("Something failed"))
                        else resolve(data)
                      })
                    })
                  }}
                  sendCommand={sendCommand}
                  dispatchAction={dispatchAction}
                  openDispatchDialog={openDispatchModal}
                />
              )
            }

            return null
          })
        )}
      </TimelineContainer>
      <TimelineFilterModal
        isOpen={isFilterOpen}
        onClose={() => {
          closeFilter()
        }}
        hiddenCommands={hiddenCommands}
        setHiddenCommands={setHiddenCommands}
      />
    </Container>
  )
}

export default ConsoleLog

const useDebouncedSearchInput = (
  initialValue: string,
  setSearch: (search: string) => void,
  delay: number = 300
) => {
  const [searchString, setSearchString] = React.useState<string>(initialValue)
  const debouncedOnChange = useMemo(() => debounce(setSearch, delay), [delay, setSearch])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setSearchString(value)
      debouncedOnChange(value)
    },
    [debouncedOnChange]
  )

  return {
    searchString,
    handleInputChange,
  }
}
