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
import { Search } from "lucide-react";
import { listCandidatesService, blockCandidateService } from "@/services/admin";

import { Candidate } from "@/types/CandidateType";

export default function CandidateTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
  const [openDialog, setOpenDialog] = useState(false);
  const [blockStatus, setBlockStatus] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidateData, setCandidateData] = useState<Candidate[]>([]);
  const itemsPerPage = 8;

  // Fetch candidates only once on component mount
  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await listCandidatesService();
        setCandidateData(response.data?.candidates);
      } catch (error) {
        console.log(error);
      }
    };
    getCandidates();
  }, []);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCandidates = candidateData.filter(
    (candidate) =>
      (candidate.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (candidate.email || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (candidate.profession || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCandidates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAction = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setBlockStatus(!candidate.isBlocked);
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      if (selectedCandidate) {
        await blockCandidateService(selectedCandidate?._id, blockStatus);
        setCandidateData((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate._id === selectedCandidate._id
              ? { ...candidate, isBlocked: blockStatus }
              : candidate
          )
        );
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by name, email, or profession..."
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
              <TableHead className="w-[200px] text-left">Name</TableHead>
              <TableHead className="text-left">Email</TableHead>
              <TableHead className="text-left">Profession</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((candidate) => (
              <TableRow key={candidate._id}>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.profession}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      candidate.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {candidate.isBlocked ? "Blocked" : "Active"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={candidate.isBlocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleAction(candidate)}
                  >
                    {candidate.isBlocked ? "Unblock" : "Block"}
                  </Button>
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

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blockStatus
                ? "Confirm Block Candidate"
                : "Confirm Unblock Candidate"}
            </DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to {blockStatus ? "block" : "unblock"}{" "}
            {selectedCandidate?.name}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={blockStatus ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
