import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import CampaignList from "../components/CampaignList";
import useDebounce from "../hooks/useDebounce.js";

const { Option } = Select;

const HomePage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    // Debounce search term with 500ms delay
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 8,
                    sortBy,
                    sortOrder,
                });

                if (debouncedSearchTerm.trim()) {
                    params.append("search", debouncedSearchTerm.trim());
                }

                const response = await axiosInstance.get(
                    `/api/campaigns?${params.toString()}`
                );
                setCampaigns(response.data.data);
                setTotal(response.data.total || 0);
            } catch (error) {
                console.error("Failed to fetch campaigns:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [currentPage, debouncedSearchTerm, sortBy, sortOrder]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (value) => {
        const [field, order] = value.split("-");
        setSortBy(field);
        setSortOrder(order);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-5 py-8">
            <div className="flex flex-col mb-10 lg:flex-row gap-6 items-center justify-between">
                <div className="flex-1 max-w-lg">
                    <Input
                        placeholder="Search funding needs..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        prefix={<SearchOutlined className="text-green-400" />}
                        size="large"
                        className="rounded-xl"
                        style={{
                            borderColor: "#10b981",
                            borderWidth: "2px",
                        }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-green-700">
                        Sort by:
                    </span>
                    <Select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={handleSortChange}
                        size="large"
                        className="w-48"
                        style={{
                            borderRadius: "12px",
                        }}
                    >
                        <Option value="createdAt-desc">Newest First</Option>
                        <Option value="createdAt-asc">Oldest First</Option>
                        <Option value="goalAmount-desc">Highest Goal</Option>
                        <Option value="goalAmount-asc">Lowest Goal</Option>
                        <Option value="currentAmount-desc">Most Raised</Option>
                        <Option value="currentAmount-asc">Least Raised</Option>
                        <Option value="deadline-asc">Deadline Soon</Option>
                        <Option value="deadline-desc">Deadline Later</Option>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <CampaignList campaigns={campaigns} />

                    {total > 8 && (
                        <div className="flex justify-center items-center mt-8">
                            <Pagination
                                current={currentPage}
                                total={total}
                                pageSize={8}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`
                                }
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
