import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730361042609 implements MigrationInterface {
    name = ' $npmConfigName1730361042609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "context" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "deleted" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test_answer_describe" ADD CONSTRAINT "FK_95e91b405e79f6ceb376fca5f9f" FOREIGN KEY ("test_question") REFERENCES "test_question_desc_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_answer" ADD CONSTRAINT "FK_8b26ee083f70b48f5562b6733d0" FOREIGN KEY ("test_question") REFERENCES "test_question_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_summary_describe" ADD CONSTRAINT "FK_3e638f579c744d18f4a863c2ff6" FOREIGN KEY ("candidate_summary") REFERENCES "candidate_summary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_sub_picture" ADD CONSTRAINT "FK_80070d9252ec60a1906ccc5e433" FOREIGN KEY ("candidate_schedule_test_sub") REFERENCES "candidate_schedule_test_sub"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_sub" ADD CONSTRAINT "FK_447afe13c33f2f27d3995931ab7" FOREIGN KEY ("test_sub") REFERENCES "test_sub"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" ADD CONSTRAINT "FK_f77a8019a62f41527deed0a4611" FOREIGN KEY ("candidate_schedule_test_sub") REFERENCES "candidate_schedule_test_sub"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" ADD CONSTRAINT "FK_459d38b0377b272b9f5c175ddcf" FOREIGN KEY ("questions_item") REFERENCES "test_question_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" ADD CONSTRAINT "FK_459d38b0377b272b9f5c175ddcf" FOREIGN KEY ("questions_item") REFERENCES "test_question_desc_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" DROP CONSTRAINT "FK_459d38b0377b272b9f5c175ddcf"`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" DROP CONSTRAINT "FK_459d38b0377b272b9f5c175ddcf"`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_answer" DROP CONSTRAINT "FK_f77a8019a62f41527deed0a4611"`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_sub" DROP CONSTRAINT "FK_447afe13c33f2f27d3995931ab7"`);
        await queryRunner.query(`ALTER TABLE "candidate_schedule_test_sub_picture" DROP CONSTRAINT "FK_80070d9252ec60a1906ccc5e433"`);
        await queryRunner.query(`ALTER TABLE "candidate_summary_describe" DROP CONSTRAINT "FK_3e638f579c744d18f4a863c2ff6"`);
        await queryRunner.query(`ALTER TABLE "test_answer" DROP CONSTRAINT "FK_8b26ee083f70b48f5562b6733d0"`);
        await queryRunner.query(`ALTER TABLE "test_answer_describe" DROP CONSTRAINT "FK_95e91b405e79f6ceb376fca5f9f"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
