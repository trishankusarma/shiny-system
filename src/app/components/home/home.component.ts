import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { Book, Author } from 'src/app/core/models/book-response.model';
import { SubjectsService } from '../../core/services/subjects.service';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;

  constructor(
    private subjectsService: SubjectsService
  ) {
    this.bookSearch = new FormControl('');
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  limit : number = 10

  allBooks: Book[] = [];
  searchedAllBooks : Book[] = [];
  searchedBooks: Book[] = [];
  searchAuthor: Author[] = [];
  currPage : number = 0

  isLoading: boolean = true;
  topOrNext : string = ""

  getAllBooks() {
    this.topOrNext = "Top"
    this.trendingSubjects.forEach(subject => {
      this.subjectsService.getAllBooks(subject.name).subscribe((data) => {
        console.log("data",data?.works)
        this.allBooks.push(...data?.works)
        this.isLoading = false;
      });
    });
  }

  decrement(){

    if( this.currPage == 0 ) return 

    this.currPage = this.currPage - 1

    if( this.currPage > 0 ) this.topOrNext = "Next"

    this.searchedBooks = this.searchedAllBooks.splice(this.currPage*this.limit, this.limit)
  }

  increment(){
    this.currPage = this.currPage + 1

    if( this.currPage > 0 ) this.topOrNext = "Next"

    this.searchedBooks = this.searchedAllBooks.splice(this.currPage*this.limit, this.limit)
  }

  searchBooks(value : string) {
      this.currPage = 0
      if (value == ""){
        this.searchedBooks = []
        return;
      }
      const reg = new RegExp(`${value}`, "gi");
      this.searchedAllBooks = this.allBooks?.filter((book) => {
            
         if( book.title?.match(reg) ) return true
         
         this.searchAuthor = book.authors?.filter((author : Author)=> author.name?.match(reg))

         return this.searchAuthor.length >0
      }).sort()
     this.searchedBooks = this.searchedAllBooks.splice(0, this.limit)
  }

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
          this.isLoading = true;
          this.searchBooks(value)
      });
    this.isLoading = true;
    this.getAllBooks()
  }
}
