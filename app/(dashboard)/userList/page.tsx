import CustomersTable from "@/components/userList/UserTable";

export default function CustomersPage() {
  return (
    <div className="p-4 mt-16 ">
      <h1 className=" text-3xl font-medium text-gray-700 mb-6">User List</h1>
      <CustomersTable />
    </div>
  );
}
