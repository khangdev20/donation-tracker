import {
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Progress,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import DonationInputModal from "../../components/DonationInputModal";
import DonorsList from "../../components/DonorsList";
import { formatAmount, progressPercentage } from "../../utils";
import { beautifyDate } from "../../utils/datetime";

const { Title, Text, Paragraph } = Typography;

const CampaignDetail = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [donationModalOpen, setDonationModalOpen] = useState(false);

    const handleDonate = () => {
        setDonationModalOpen(true);
    };

    useEffect(() => {
        const fetchCampaign = async () => {
            const response = await axiosInstance.get(`/api/campaigns/${id}`);
            setCampaign(response.data.data);
        };
        fetchCampaign();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Card
                    className="mb-8 overflow-hidden"
                    style={{ borderRadius: "24px" }}
                >
                    <div className="relative">
                        <img
                            src={campaign?.imageUrl}
                            alt="Campaign"
                            className="w-full h-96 object-cover"
                        />
                        <div className="absolute top-6 right-6">
                            <Tag
                                color="green"
                                className="text-sm font-semibold"
                            >
                                {Math.ceil(
                                    (new Date(campaign?.deadline) -
                                        new Date()) /
                                        (1000 * 60 * 60 * 24)
                                )}
                                d left
                            </Tag>
                        </div>
                    </div>

                    <div className="p-8">
                        <Row gutter={32}>
                            <Col xs={24} lg={16}>
                                <Title level={1} className="mb-4">
                                    {campaign?.title}
                                </Title>

                                <Space className="mb-6">
                                    <Avatar
                                        src="https://via.placeholder.com/48x48"
                                        size={48}
                                        icon={<UserOutlined />}
                                    />
                                    <div>
                                        <Text strong className="block">
                                            {campaign?.createdBy?.name}
                                        </Text>
                                        <Text
                                            type="secondary"
                                            className="text-sm"
                                        >
                                            Campaign Creator
                                        </Text>
                                    </div>
                                </Space>

                                <div className="mb-8">
                                    <Paragraph className="text-gray-700 leading-relaxed">
                                        {campaign?.description}
                                    </Paragraph>
                                </div>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Card
                                    className="sticky top-8"
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        borderRadius: "16px",
                                    }}
                                >
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <Text className="text-2xl font-bold text-green-600">
                                                {formatAmount(
                                                    campaign?.currentAmount
                                                )}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                className="text-sm"
                                            >
                                                of{" "}
                                                {formatAmount(
                                                    campaign?.goalAmount
                                                )}{" "}
                                                goal
                                            </Text>
                                        </div>

                                        <Progress
                                            percent={progressPercentage(
                                                campaign?.currentAmount,
                                                campaign?.goalAmount
                                            )}
                                            strokeColor={{
                                                "0%": "#10b981",
                                                "100%": "#059669",
                                            }}
                                            className="mb-4"
                                        />

                                        <Row
                                            gutter={16}
                                            className="text-center"
                                        >
                                            <Col span={12}>
                                                <Text className="text-2xl font-bold text-gray-800 block">
                                                    {Math.ceil(
                                                        (campaign?.currentAmount /
                                                            campaign?.goalAmount) *
                                                            100
                                                    )}{" "}
                                                    %
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    className="text-sm"
                                                >
                                                    Funded
                                                </Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text className="text-2xl font-bold text-gray-800 block">
                                                    {campaign?.backers}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    className="text-sm"
                                                >
                                                    Backers
                                                </Text>
                                            </Col>
                                        </Row>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleDonate}
                                        className="w-full mb-4"
                                        style={{
                                            height: "48px",
                                            borderRadius: "12px",
                                            backgroundColor: "#059669",
                                            borderColor: "#059669",
                                        }}
                                        disabled={
                                            progressPercentage(
                                                campaign?.currentAmount,
                                                campaign?.goalAmount
                                            ) >= 100
                                        }
                                    >
                                        {progressPercentage(
                                            campaign?.currentAmount,
                                            campaign?.goalAmount
                                        ) < 100
                                            ? "Donate Now"
                                            : "Funded"}
                                    </Button>
                                    <DonationInputModal
                                        fundingNeedId={id}
                                        open={donationModalOpen}
                                        onCancel={() =>
                                            setDonationModalOpen(false)
                                        }
                                    />

                                    <Space
                                        direction="vertical"
                                        className="w-full"
                                        size="small"
                                    >
                                        <div className="flex justify-between">
                                            <Space>
                                                <CalendarOutlined />
                                                <Text type="secondary">
                                                    Campaign ends:
                                                </Text>
                                            </Space>
                                            <Text strong>
                                                {beautifyDate(
                                                    campaign?.deadline
                                                )}
                                            </Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Space>
                                                <EnvironmentOutlined />
                                                <Text type="secondary">
                                                    Location:
                                                </Text>
                                            </Space>
                                            <Text strong>Rural Kenya</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Card>

                <Row gutter={32}>
                    <Col xs={24} lg={8}>
                        <Card
                            title="Recent Updates"
                            style={{ borderRadius: "16px" }}
                        >
                            <Space
                                direction="vertical"
                                className="w-full"
                                size="large"
                            >
                                <div className="border-l-4 border-green-500 pl-4">
                                    <Text strong className="block">
                                        Well Construction Begins!
                                    </Text>
                                    <Text
                                        type="secondary"
                                        className="text-sm block mb-2"
                                    >
                                        2 days ago
                                    </Text>
                                    <Text>
                                        We've reached our first milestone and
                                        construction has officially begun...
                                    </Text>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <Text strong className="block">
                                        50% Funding Milestone Reached
                                    </Text>
                                    <Text
                                        type="secondary"
                                        className="text-sm block mb-2"
                                    >
                                        1 week ago
                                    </Text>
                                    <Text>
                                        Thanks to all our amazing backers, we've
                                        reached 50% of our funding goal...
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* Comments */}
                    <Col xs={24} lg={8}>
                        <Card title="Comments" style={{ borderRadius: "16px" }}>
                            <Space
                                direction="vertical"
                                className="w-full"
                                size="large"
                            >
                                <div className="flex gap-3">
                                    <Avatar
                                        src="https://via.placeholder.com/40x40"
                                        size={40}
                                        icon={<UserOutlined />}
                                    />
                                    <div className="flex-1">
                                        <Text strong className="block">
                                            Sarah Johnson
                                        </Text>
                                        <Text
                                            type="secondary"
                                            className="text-sm block mb-1"
                                        >
                                            3 days ago
                                        </Text>
                                        <Text>
                                            This is such an important cause.
                                            Happy to support!
                                        </Text>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Avatar
                                        src="https://via.placeholder.com/40x40"
                                        size={40}
                                        icon={<UserOutlined />}
                                    />
                                    <div className="flex-1">
                                        <Text strong className="block">
                                            Mike Chen
                                        </Text>
                                        <Text
                                            type="secondary"
                                            className="text-sm block mb-1"
                                        >
                                            5 days ago
                                        </Text>
                                        <Text>
                                            Looking forward to seeing the impact
                                            this will make!
                                        </Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            title="Top Donors"
                            style={{ borderRadius: "16px" }}
                        >
                            <Space
                                direction="vertical"
                                className="w-full"
                                size="large"
                            >
                                <DonorsList campaignId={id} />
                            </Space>
                            <Divider />
                            <Text
                                type="secondary"
                                className="text-xs text-center block"
                            >
                                Showing top 5 donors • 122 more supporters
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CampaignDetail;
