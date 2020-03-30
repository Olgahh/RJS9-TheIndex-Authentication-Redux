import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

// Components
import BookTable from "./BookTable";
import AddBookModal from "./AddBookButton";
import Loading from "./Loading";

const AuthorDetail = ({ authors, books, loading, match, user }) => {
  if (loading) return <Loading />;

  const { authorID } = match.params;
  const author = authors.find(author => author.id === +authorID);

  if (!author) return <Redirect to="/" />;

  const authorName = `${author.first_name} ${author.last_name}`;
  const authorBooks = books.filter(book =>
    book.authors.map(author => author.id).includes(author.id)
  );

  return (
    <div className="author">
      <div>
        <h3>{authorName}</h3>
        <img
          src={author.imageUrl}
          className="img-thumbnail img-fluid"
          alt={authorName}
        />
      </div>
      <BookTable books={authorBooks} />
      {user && <AddBookModal authorID={author.id} />}
    </div>
  );
};

const mapStateToProps = ({ authors, books, user }) => {
  return {
    authors,
    books,
    loading: !authors.length || !books.length,
    user
  };
};

export default connect(mapStateToProps)(AuthorDetail);
