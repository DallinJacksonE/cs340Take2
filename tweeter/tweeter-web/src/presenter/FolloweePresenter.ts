import { Follow } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface FolloweeView {

}
export class FolloweePresenter {
    private service: FollowService;
    private view: FolloweeView;


    constructor(view: FolloweeView) {
        this.service = new FollowService();
        this.view = view

    }

    
}