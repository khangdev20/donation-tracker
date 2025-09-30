import { UserOutlined } from "@ant-design/icons";
import { Avatar, Empty, Typography } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const { Text } = Typography;

const DonorsList = ({ campaignId }) => {
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        const fetchDonors = async () => {
            const response = await axiosInstance.get(
                `/api/campaigns/${campaignId}/donors?limit=10`
            );
            setDonors(response.data.data);
        };
        fetchDonors();
    }, [campaignId]);

    return (
        <div>
            {donors.length > 0 ? (
                donors.map((donor, index) => (
                    <div className="flex items-center gap-3" key={donor._id}>
                        <Avatar
                            style={{ backgroundColor: "#faad14" }}
                            size={32}
                        >
                            {index + 1}
                        </Avatar>
                        <Avatar
                            src="https://via.placeholder.com/40x40"
                            size={40}
                            icon={<UserOutlined />}
                        />
                        <div className="flex-1">
                            <Text strong className="block">
                                {donor.name}
                            </Text>
                            <Text className="text-green-600 font-semibold">
                                {donor.amount}
                            </Text>
                        </div>
                    </div>
                ))
            ) : (
                <Empty description="No donors found" />
            )}
        </div>
    );
};

export default DonorsList;
