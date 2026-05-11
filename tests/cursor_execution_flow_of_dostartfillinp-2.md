# Execution flow of doStartFillinProcess
_Exported on 5/11/2026 at 14:12:09 PDT from Cursor (3.3.30)_

---

**User**

There is a function called `doStartFillinProcess`. Is it possible to create a diagram illustrating what happens inside this function—specifically, which other functions it calls—that is, the entire execution flow of this function? @src/context-scripts/01-content.201.dog/7-process-fillin/0-all-start-loop.ts:14 

---

**Cursor**

Yes, I can create a diagram that illustrates the entire execution flow of the `doStartFillinProcess` function, including all the nested function calls it makes.

Here is a Mermaid diagram that visualizes the execution flow. You can view this diagram directly in the chat:

```mermaid
flowchart TD
    Start([doStartFillinProcess]) --> CheckWait{augSend.wait?}
    CheckWait -- Yes --> delayFlow1[delayFlow]
    delayFlow1 --> PrintStart[print_StartedPhase]
    CheckWait -- No --> PrintStart
    
    PrintStart --> LoopItems{For each se in\nfillinData.fillinItems}
    
    LoopItems --> SendElement[se.sendElement]
    
    %% FillinItem.sendElement subgraph
    subgraph SendElement Flow
        SendElement --> getPgbs[getPgbs]
        getPgbs --> HasPgbs{Has Piggybacks?}
        
        HasPgbs -- No --> setFocusAndValue[setFocusAndValue]
        setFocusAndValue --> setFocus[setFocus] --> setDomFocus1[setDomFocus]
        setFocusAndValue --> sendValue[sendValue] --> sendDomValue1[sendDomValue]
        
        HasPgbs -- Yes --> LoopPgbs{For each pgb}
        LoopPgbs --> doPgb[doPgb]
        doPgb --> getPgbElement[getPgbElement]
        doPgb --> doSinglePiggyback[doSinglePiggyback]
        
        doSinglePiggyback --> SwitchAction{Switch pgbAction}
        SwitchAction --> setDomClick[setDomClick]
        SwitchAction --> sendMsgEnterKey1[sendMsgEnterKeyByDpAgent]
        SwitchAction --> setDomEnterKey[setDomEnterKey]
        SwitchAction --> setDomFocus2[setDomFocus]
        SwitchAction --> sendDomValue2[sendDomValue]
    end
    
    SendElement --> CheckBreak{breakPhase?}
    CheckBreak -- Yes --> Return1([Return])
    CheckBreak -- No --> LoopItems
    
    LoopItems -- Loop Ends --> CheckLast{augSend.last?}
    CheckLast -- Yes --> doSendLastAction[doSendLastAction]
    
    %% doSendLastAction subgraph
    subgraph LastAction Flow
        doSendLastAction --> queryShadow1[queryShadow]
        doSendLastAction --> SwitchLastAct{Switch action}
        SwitchLastAct --> sendMsgEnterKey2[sendMsgEnterKeyByDpAgent]
    end
    
    doSendLastAction --> CheckLastReturn{returns true?}
    CheckLastReturn -- Yes --> Return2([Return])
    CheckLastReturn -- No --> CheckEndk
    
    CheckLast -- No --> CheckEndk{augSend.endk?}
    CheckEndk -- Yes --> doSendKeystrokes[doSendKeystrokes]
    
    %% doSendKeystrokes subgraph
    subgraph Keystrokes Flow
        doSendKeystrokes --> queryShadow2[queryShadow]
        doSendKeystrokes --> toBg[toBg]
        doSendKeystrokes --> delayFlow2[delayFlow]
    end
    
    doSendKeystrokes --> CheckSent{sent?}
    CheckSent -- Yes --> Return3([Return])
    CheckSent -- No --> PrintSubmit
    
    CheckEndk -- No --> PrintSubmit[print_FillinSendSubmitStarted]
    
    PrintSubmit --> part_Submit[part_Submit]
    
    %% part_Submit subgraph
    subgraph Submit Flow
        part_Submit --> print_doSubmitDefault[print_doSubmitDefault]
        part_Submit --> CheckDoSubmit{dosubmit?}
        CheckDoSubmit -- No --> focusOnly[elmEditForSubmit.focus]
        CheckDoSubmit -- Yes --> doSubmitDefault[doSubmitDefault]
        
        doSubmitDefault --> lockFields1[lockFields unlock]
        doSubmitDefault --> doSubmitAction[doSubmitAction]
        
        doSubmitAction --> print_doSubmitAction[print_doSubmitAction]
        doSubmitAction --> sendMsgEnterKey3[sendMsgEnterKeyByDpAgent]
        doSubmitAction --> doSubmitByClickOnElement[doSubmitByClickOnElement]
        
        doSubmitByClickOnElement --> print_SentWitInput[print_SentWitInput]
        doSubmitByClickOnElement --> print_SentWithButton[print_SentWithButton]
        doSubmitByClickOnElement --> print_NoSubmit[print_NoSubmit]
        
        doSubmitAction --> lockFields2[lockFields lock]
    end
    
    part_Submit --> Return4([Return])
```

### Summary of the Execution Flow

```mermaid
flowchart TD
    Start([doStartFillinProcess]) --> CheckWait{augSend.wait?}
    CheckWait -- Yes --> delayFlow1[delayFlow]
    delayFlow1 --> PrintStart[print_StartedPhase]
    CheckWait -- No --> PrintStart
    
    PrintStart --> LoopItems{For each se in\nfillinData.fillinItems}
    
    LoopItems --> SendElement[se.sendElement]
    
    %% FillinItem.sendElement subgraph
    subgraph SendElement Flow
        SendElement --> getPgbs[getPgbs]
        getPgbs --> HasPgbs{Has Piggybacks?}
        
        HasPgbs -- No --> setFocusAndValue[setFocusAndValue]
        setFocusAndValue --> setFocus[setFocus] --> setDomFocus1[setDomFocus]
        setFocusAndValue --> sendValue[sendValue] --> sendDomValue1[sendDomValue]
        
        HasPgbs -- Yes --> LoopPgbs{For each pgb}
        LoopPgbs --> doPgb[doPgb]
        doPgb --> getPgbElement[getPgbElement]
        doPgb --> doSinglePiggyback[doSinglePiggyback]
        
        doSinglePiggyback --> SwitchAction{Switch pgbAction}
        SwitchAction --> setDomClick[setDomClick]
        SwitchAction --> sendMsgEnterKey1[sendMsgEnterKeyByDpAgent]
        SwitchAction --> setDomEnterKey[setDomEnterKey]
        SwitchAction --> setDomFocus2[setDomFocus]
        SwitchAction --> sendDomValue2[sendDomValue]
    end
    
    SendElement --> CheckBreak{breakPhase?}
    CheckBreak -- Yes --> Return1([Return])
    CheckBreak -- No --> LoopItems
    
    LoopItems -- Loop Ends --> CheckLast{augSend.last?}
    CheckLast -- Yes --> doSendLastAction[doSendLastAction]
    
    %% doSendLastAction subgraph
    subgraph LastAction Flow
        doSendLastAction --> queryShadow1[queryShadow]
        doSendLastAction --> SwitchLastAct{Switch action}
        SwitchLastAct --> sendMsgEnterKey2[sendMsgEnterKeyByDpAgent]
    end
    
    doSendLastAction --> CheckLastReturn{returns true?}
    CheckLastReturn -- Yes --> Return2([Return])
    CheckLastReturn -- No --> CheckEndk
    
    CheckLast -- No --> CheckEndk{augSend.endk?}
    CheckEndk -- Yes --> doSendKeystrokes[doSendKeystrokes]
    
    %% doSendKeystrokes subgraph
    subgraph Keystrokes Flow
        doSendKeystrokes --> queryShadow2[queryShadow]
        doSendKeystrokes --> toBg[toBg]
        doSendKeystrokes --> delayFlow2[delayFlow]
    end
    
    doSendKeystrokes --> CheckSent{sent?}
    CheckSent -- Yes --> Return3([Return])
    CheckSent -- No --> PrintSubmit
    
    CheckEndk -- No --> PrintSubmit[print_FillinSendSubmitStarted]
    
    PrintSubmit --> part_Submit[part_Submit]
    
    %% part_Submit subgraph
    subgraph Submit Flow
        part_Submit --> print_doSubmitDefault[print_doSubmitDefault]
        part_Submit --> CheckDoSubmit{dosubmit?}
        CheckDoSubmit -- No --> focusOnly[elmEditForSubmit.focus]
        CheckDoSubmit -- Yes --> doSubmitDefault[doSubmitDefault]
        
        doSubmitDefault --> lockFields1[lockFields unlock]
        doSubmitDefault --> doSubmitAction[doSubmitAction]
        
        doSubmitAction --> print_doSubmitAction[print_doSubmitAction]
        doSubmitAction --> sendMsgEnterKey3[sendMsgEnterKeyByDpAgent]
        doSubmitAction --> doSubmitByClickOnElement[doSubmitByClickOnElement]
        
        doSubmitByClickOnElement --> print_SentWitInput[print_SentWitInput]
        doSubmitByClickOnElement --> print_SentWithButton[print_SentWithButton]
        doSubmitByClickOnElement --> print_NoSubmit[print_NoSubmit]
        
        doSubmitAction --> lockFields2[lockFields lock]
    end
    
    part_Submit --> Return4([Return])
```
