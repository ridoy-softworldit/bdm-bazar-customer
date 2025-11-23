import AllAuthor from "@/Component/Author/AllAuthor";
import PopularAuthorPageCarousel from "@/Component/Author/PopularAuthorPageCarousel";

const page = () => {
  return (
    <div className="bg-gray-100">
      <div className="sm:w-[80vw] w-[95vw] m-auto ">
        <PopularAuthorPageCarousel></PopularAuthorPageCarousel>
        <AllAuthor></AllAuthor>
      </div>
    </div>
  );
};

export default page;
