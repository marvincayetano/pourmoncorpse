-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "PreferedSchedule" (
    "id" SERIAL NOT NULL,
    "date" "Day" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreferedSchedule" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
