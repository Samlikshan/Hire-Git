import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { listCompaniesService, reveiwCompanyService } from "@/services/admin";

import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
export default function CompanyTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [actionType, setActionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [companyData, setCompanyData] = useState([]);
  const itemsPerPage = 8;

  const userData = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await listCompaniesService();
        setCompanyData(response.data?.companies);
      } catch (error) {
        console.log(error);
      }
    };
    getCompanies();
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter companies based on search query
  const filteredCompanies = companyData.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAction = (company, action) => {
    setSelectedCompany(company);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await reveiwCompanyService(
        selectedCompany?._id,
        userData.userData._id,
        actionType,
        declineReason
      );

      setOpenDialog(false);
      if (response.status == 200) {
        const data = companyData.filter((company) => {
          if (company._id == selectedCompany._id) {
            return (selectedCompany.accountStatus.status =
              actionType.charAt(0).toUpperCase() + actionType.slice(1) + "ed");
          }
          return company;
        });
        setCompanyData(data);
      }
      setDeclineReason("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by name, email, or industry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg"
        />
        <Button variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-left">Company</TableHead>
              <TableHead className="text-left">Contact</TableHead>
              <TableHead className="text-left">Industry</TableHead>
              <TableHead className="text-left">Document</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((company) => (
              <TableRow key={company._id}>
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    onClick={() => setSelectedCompany(company)}
                  >
                    {company.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {company.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {company.contactNumber}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedCompany(company);
                      setOpenPdf(true);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>View PDF</span>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {company.accountStatus.status == "Pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(company, "accept")}
                      >
                        Accept
                      </Button>
                    )}
                    {company.accountStatus.status == "Pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction(company, "reject")}
                      >
                        Decline
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Action Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept"
                ? "Confirm Acceptance"
                : "Decline Company"}
            </DialogTitle>
          </DialogHeader>
          {actionType === "reject" ? (
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter reason for declining"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              Are you sure you want to accept {selectedCompany?.name}?
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "accept" ? "default" : "destructive"}
              onClick={handleConfirm}
            >
              {actionType === "accept" ? "Confirm" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={openPdf} onOpenChange={setOpenPdf}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] w-full rounded-md border">
            {selectedCompany?.registrationDocument ? (
              <iframe
                src={`${import.meta.env.VITE_S3_PATH}/${
                  selectedCompany?.registrationDocument
                }`}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <p className="text-center text-muted-foreground p-4">
                No document available.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPdf(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
