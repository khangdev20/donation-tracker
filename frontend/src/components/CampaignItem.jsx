import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Progress, Tag, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const CampaignItem = ({ campaign }) => {
    const {
        _id,
        title,
        goalAmount,
        currentAmount = 0,
        currency,
        deadline,
        imageUrl,
        createdBy,
        status,
    } = campaign;

    const progressPercentage = Math.min(
        (currentAmount / goalAmount) * 100,
        100
    );
    const daysLeft = Math.ceil(
        (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    const isExpired = daysLeft < 0;

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: currency || "AUD",
        }).format(amount);
    };

    const getStatusColor = () => {
        if (isExpired) return "red";
        if (daysLeft <= 7) return "orange";
        return "green";
    };

    const getStatusText = () => {
        if (isExpired) return "Expired";
        return `${daysLeft}d left`;
    };

    return (
        <Link to={`/fundraisers/${_id}`}>
            <Card
                hoverable
                className="h-full"
                style={{ borderRadius: "24px" }}
                cover={
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-52 object-cover rounded-t-2xl"
                        />
                        <div className="absolute top-3 right-3">
                            <Tag
                                color={getStatusColor()}
                                className="font-semibold"
                            >
                                {getStatusText()}
                            </Tag>
                        </div>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Title level={4} className="mb-3 line-clamp-2 h-14">
                        {title}
                    </Title>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Tag
                                color={
                                    status === "completed" ? "green" : "blue"
                                }
                                className="text-xs"
                                style={{
                                    borderRadius: "12px",
                                    padding: "2px 10px",
                                }}
                            >
                                {status === "completed"
                                    ? "Completed"
                                    : "In Progress"}
                            </Tag>
                            <Text strong className="text-green-700">
                                {Math.round(progressPercentage)}%
                            </Text>
                        </div>
                        <Progress
                            percent={progressPercentage}
                            strokeColor={{
                                "0%": "#10b981",
                                "100%": "#059669",
                            }}
                            showInfo={false}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <Text
                                type="secondary"
                                className="text-xs uppercase block"
                            >
                                Raised
                            </Text>
                            <Text strong className="text-base">
                                {formatAmount(currentAmount)}
                            </Text>
                        </div>
                        <div className="text-right">
                            <Text
                                type="secondary"
                                className="text-xs uppercase block"
                            >
                                Goal
                            </Text>
                            <Text strong className="text-base">
                                {formatAmount(goalAmount)}
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                            <Avatar
                                size="small"
                                src={createdBy?.avatar}
                                icon={<UserOutlined />}
                            />
                            <div>
                                <Text type="secondary" className="text-xs">
                                    Created by{" "}
                                </Text>
                                <Text strong className="text-xs text-green-700">
                                    {createdBy?.name || "Anonymous"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default CampaignItem;
