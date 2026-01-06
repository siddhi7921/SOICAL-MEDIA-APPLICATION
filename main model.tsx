import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Order "mo:base/Order";
import Runtime "mo:base/Runtime";

actor SocialMediaApp {

  /*************************
   * TYPES
   *************************/

  public type ContentType = {
    #text;
    #image;
    #video;
    #shortVideo;
  };

  public type Post = {
    id: Nat;
    author: Principal;
    content: Text;
    contentType: ContentType;
    timestamp: Int;
  };

  public type Comment = {
    id: Nat;
    postId: Nat;
    author: Principal;
    text: Text;
    timestamp: Int;
  };

  /*************************
   * ACCESS CONTROL (SIMPLE)
   *************************/

  stable var admins : [Principal] = [];

  func isAdmin(p : Principal) : Bool {
    Array.find<Principal>(admins, func(a) = a == p) != null
  };

  func isUser(p : Principal) : Bool {
    p != Principal.fromText("2vxsx-fae") // anonymous
  };

  /*************************
   * STORAGE
   *************************/

  stable var postCounter : Nat = 0;
  stable var commentCounter : Nat = 0;

  let posts = HashMap.HashMap<Nat, Post>(10, Nat.equal, Nat.hash);
  let comments = HashMap.HashMap<Nat, Comment>(10, Nat.equal, Nat.hash);

  /*************************
   * POSTS
   *************************/

  public shared ({ caller }) func createPost(
    content : Text,
    contentType : ContentType
  ) : async Post {

    if (not isUser(caller)) {
      Runtime.trap("Unauthorized: Login required");
    };

    let post : Post = {
      id = postCounter;
      author = caller;
      content = content;
      contentType = contentType;
      timestamp = Time.now();
    };

    posts.put(postCounter, post);
    postCounter += 1;

    return post;
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    let allPosts = posts.values().toArray();

    allPosts.sort(func(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });

    return allPosts;
  };

  public query ({ caller }) func getUserPosts(user : Principal) : async [Post] {
    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    return posts.values().toArray().filter(
      func(p : Post) : Bool {
        p.author == user
      }
    );
  };

  public query ({ caller }) func getShortVideos() : async [Post] {
    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    let shorts = posts.values().toArray().filter(
      func(p : Post) : Bool {
        switch (p.contentType) {
          case (#shortVideo) { true };
          case (_) { false };
        }
      }
    );

    shorts.sort(func(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });

    return shorts;
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    switch (posts.get(postId)) {
      case (?post) {
        if (post.author != caller and not isAdmin(caller)) {
          Runtime.trap("Only owner or admin can delete post");
        };
        posts.remove(postId);
      };
      case null {
        Runtime.trap("Post not found");
      };
    };
  };

  /*************************
   * COMMENTS
   *************************/

  public shared ({ caller }) func addComment(
    postId : Nat,
    text : Text
  ) : async Comment {

    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    if (posts.get(postId) == null) {
      Runtime.trap("Post does not exist");
    };

    let comment : Comment = {
      id = commentCounter;
      postId = postId;
      author = caller;
      text = text;
      timestamp = Time.now();
    };

    comments.put(commentCounter, comment);
    commentCounter += 1;

    return comment;
  };

  public query ({ caller }) func getComments(postId : Nat) : async [Comment] {
    if (not isUser(caller)) {
      Runtime.trap("Unauthorized");
    };

    return comments.values().toArray().filter(
      func(c : Comment) : Bool {
        c.postId == postId
      }
    );
  };

  /*************************
   * ADMIN
   *************************/

  public shared ({ caller }) func addAdmin(user : Principal) : async () {
    if (admins.size() == 0 or isAdmin(caller)) {
      admins := Array.append(admins, [user]);
    } else {
      Runtime.trap("Only admin can add admin");
    };
  };
};

