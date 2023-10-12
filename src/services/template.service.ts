import { PrismaClient, Template } from '@prisma/client';

const prisma = new PrismaClient();

class TemplateService {
  public async addTemplate(requestBody: any) {
    try {
      const { name, text, variables } = requestBody;

      // Use Prisma to create a new template in the "Template" collection
      const newTemplate = await prisma.template.create({
        data: {
          name,
          text,
          variables: variables || [], // Assuming variables is an array
        },
      });

      return newTemplate;
    } catch (error) {
      throw error;
    }
  }

  public async getTemplate(templateName: string) {
    try {
        return await prisma.template.findFirst({
            where: {
              name: String(templateName),
            },
          });
    } catch (error) {
        throw error
    }

  }

  public async updateTemplate(templateId: string, requestBody: any) {
    const { name, text, variables } = requestBody;

    return await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        name,
        text,
        variables: variables || [],
      },
    });
  }

  public async deleteTemplate(templateId: string) {
    return await prisma.template.delete({
      where: {
        id: templateId,
      },
    });
  }
}

export default TemplateService;
