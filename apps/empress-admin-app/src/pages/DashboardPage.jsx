import { BarChart } from "@mui/x-charts/BarChart";
import OverviewCard from "../ui/OverviewCard";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import useProducts from "../hooks/useProducts";
import useCollections from "../hooks/useCollections";
import Spinner from "../ui/Spinner";

function DashboardPage() {
  // const [salesReportDataType, setSalesReportDataType] = useState("daily");
  const [salesReportData, setSalesReportData] = useState([]);
  const [collections, setCollections] = useState([]);
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();

  const {
    data: collectionsData,
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useCollections();

  useEffect(() => {
    if (collectionsData && productsData) {
      console.log("collectionsData", collectionsData);
      console.log("productsData", productsData);
      setSalesReportData(productsData);
      const collectionDataMod = collectionsData.map((collection) => {
        return {
          ...collection,
          label: collection.name,
          value: collection.products.length,
        };
      });
      setCollections(collectionDataMod);
    }
  }, [productsData, collectionsData, productsLoading, collectionsLoading]);
  if (productsLoading || collectionsLoading) {
    return <Spinner />;
  }

  if (productsError || collectionsError) {
    return (
      <div>Error: {productsError?.message || collectionsError?.message}</div>
    );
  }

  console.log("salesReportData", salesReportData);
  console.log("collections", collections);

  return (
    <div className="bg-[#F4F8FB] p-6">
      <div className="mb-8 flex items-center justify-between">
        <Heading level={1} text="Dashboard Overview" color="#2C3E50" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Sales Card */}
        <OverviewCard>
          <Heading level={4} text="Total Sales" />
          <div className="mt-4 flex w-full items-center justify-center">
            <img src="./sales-image.png" alt="" width={150} />
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-[#003566]">
            ${salesReportData.reduce((acc, data) => acc + data.revenue, 0)}
          </p>
        </OverviewCard>

        {/* Users Card */}
        <OverviewCard>
          <Heading level={4} text="Users" />
          <div className="mt-4 flex w-full items-center justify-center">
            <img src="./users-image.png" alt="" width={150} />
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-[#003566]">
            1,500
          </p>
        </OverviewCard>

        {/* Products Card */}
        <OverviewCard>
          <Heading level={4} text="Products" />
          <div className="mt-4 flex w-full items-center justify-center">
            <img src="./products-image.png" alt="" width={150} />
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-[#003566]">
            {productsData.reduce((acc, product) => acc + product.stock, 0)}
          </p>
        </OverviewCard>

        {/* Today's Orders Card */}
        <OverviewCard>
          <Heading level={4} text="Orders" />
          <div className="mt-4 flex w-full items-center justify-center">
            <img src="./orders-image.png" alt="" width={150} />
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-[#003566]">
            120
          </p>
        </OverviewCard>

        {/* Sales Report Card */}
        <OverviewCard>
          <div className="flex items-center justify-between">
            <Heading level={4} text="Sales Report" />
            {/* <select
              value={salesReportDataType}
              onChange={(e) => handleSalesReportDataTypesChange(e.target.value)}
              className="rounded bg-[#4CAF50] px-4 py-2 font-semibold text-white shadow-lg transition duration-300 hover:bg-[#45A049]"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select> */}
          </div>

          <div className="mt-6 flex items-center justify-center overflow-x-auto">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: salesReportData.map((data) => data.name.slice(0, 7)),
                },
              ]}
              series={[{ data: salesReportData.map((data) => data.itemsSold) }]}
              width={550}
              height={350}
              className="rounded-lg shadow-md"
            />
          </div>
        </OverviewCard>

        {/* Collections Card */}
        <OverviewCard cardLink="/sales" linkText="View Collections">
          <Heading level={4} text="Collections" />
          <div className="mt-6 flex items-center justify-center overflow-x-auto">
            <PieChart
              series={[
                {
                  data: collections,
                },
              ]}
              width={550}
              height={350}
              className="rounded-lg shadow-md"
            />
          </div>
        </OverviewCard>
      </div>
    </div>
  );
}

export default DashboardPage;
