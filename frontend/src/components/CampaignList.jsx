import { Empty } from "antd";
import CampaignItem from "./CampaignItem";

const CampaignList = ({ campaigns }) => {
    if (campaigns.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <Empty description="No campaigns found" />
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {campaigns.map((campaign) => (
                <CampaignItem key={campaign._id} campaign={campaign} />
            ))}
        </div>
    );
};

export default CampaignList;
