import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/from';

import { Blog } from 'app/shared/model/blog';
import { BlogActions } from "app/actions/blogAction";

@Component({
  selector: 'blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogSectionComponent implements OnInit, OnChanges {

  @Input() filter = 'All';

  blogs$: Observable<Blog[]>;

  constructor(
    private store: Store<Blog>,
    private blogActions: BlogActions) {
  }

  ngOnInit() {
    this.blogs$ = Observable.combineLatest(
      this.store.select('blog'),
      this.store.select('authorFilter'),
      (blogs: any, authorFilter: any) => {
        console.log(blogs.data);
        console.log("blogs", blogs);
        console.log("authorFilter", authorFilter);
        return blogs.data ? blogs.data.filter(authorFilter) : [];
      }
    );

    this.loadBlogs();
  }

  ngOnChanges() {
  }

  loadBlogs() {
    this.store.dispatch(this.blogActions.loadBlogs('All'));
  }

  addBlog(blog: Blog) {
    blog.author = this.filter;
    this.store.dispatch({ type: 'ADD_BLOG', payload: blog });
  }

  deleteBlog(blog: Blog) {
    this.store.dispatch({ type: 'DELETE_BLOG', payload: blog });
  }


}
