import { assert } from "console";
import { Gpio as Gpio, BinaryValue } from "onoff";

export enum GroubMsgConRunState {back = -1 , stop = 0, go = 1 }

export class GroubMsgCon {
    runMsgState: [BinaryValue, BinaryValue, BinaryValue];
    constructor() {
        this.runMsgState = [0, 0, 0];
    }
    setRunState(msg: GroubMsgConRunState):void{
        switch (msg) {
            case GroubMsgConRunState.stop:
                this.runMsgState = [0, 0, 0];
                break;
            case GroubMsgConRunState.go:
                this.runMsgState = [1, 0, 0];
                break;
            case GroubMsgConRunState.back:
                this.runMsgState = [0, 1, 0];
                break;
        }
    }
}
export class Car {
    msgChannel = [
        new Gpio(26, 'out'),
        new Gpio(19, 'out'),
        new Gpio(21, 'out'),
        new Gpio(13, 'out'),
        new Gpio(6, 'out'),
        new Gpio(16, 'out'),
    ];
    leftCon: GroubMsgCon;
    rightCon: GroubMsgCon;
    constructor() {
        this.leftCon = new GroubMsgCon();
        this.rightCon = new GroubMsgCon();
        null;
    }
    async setState(msgAggDataPackage: [number,number]): Promise<void> {
        const msgAggData =msgAggDataPackage;
        this.leftCon.setRunState(msgAggData[0]);
        this.rightCon.setRunState(msgAggData[1]);
        
        console.log(this.outStateToList());
        await this.outState();
    }
    outStateToList(): number[] {
        return [
            ...this.leftCon.runMsgState,
            ...this.rightCon.runMsgState
        ];
    }
    async outState(): Promise<void> {
        assert((this.leftCon.runMsgState.length + this.rightCon.runMsgState.length) == this.msgChannel.length);
        for (let i = 0; i < this.leftCon.runMsgState.length; i++) {
            await this.msgChannel[i].write(this.leftCon.runMsgState[i]);
        }
        for (let i = 0; i < this.rightCon.runMsgState.length; i++) {
            await this.msgChannel[i + this.leftCon.runMsgState.length].write(this.rightCon.runMsgState[i]);
        }
    }
}
