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

  allBooks: Book[] = [];
  searchedBooks: Book[] = [];
  searchAuthor: Author[] = [];

  isLoading: boolean = true;

  getAllBooks() {
    this.trendingSubjects.forEach(subject => {
      this.subjectsService.getAllBooks(subject.name).subscribe((data) => {
        console.log("data",data?.works)
        this.allBooks.push(...data?.works)
        this.isLoading = false;
      });
    });
  }

  searchBooks(value : string) {
      if (value == ""){
        this.searchedBooks = []
        return;
      }

      const limit = 10
      const reg = new RegExp(`${value}`, "gi");
      this.searchedBooks = this.allBooks?.filter((book) => {
            
         if( book.title?.match(reg) ) return true
         
         this.searchAuthor = book.authors?.filter((author : Author)=> author.name?.match(reg))

         return this.searchAuthor.length >0
      }).sort().slice(0, limit);
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
