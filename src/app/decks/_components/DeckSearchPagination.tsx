import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { RefObject } from "react";

type Props = {
  formRef: RefObject<HTMLFormElement>;
  onChangePage: (payload: FormData) => void;
  count: number | undefined;
  pagination: [number, number];
};

export function DeckSearchPagination({
  formRef,
  onChangePage,
  count,
  pagination,
}: Props) {
  function changePage(pageNumber: number) {
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    formData.get("");
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
