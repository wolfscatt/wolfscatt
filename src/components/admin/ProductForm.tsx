import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileArchive,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { z } from "zod";

import type { Tables } from "@/integrations/supabase/types";
import { createSlug } from "@/lib/slug";
import {
  getProductStorageMaxSizeMb,
  getProductStorageBucket,
  uploadProductFile,
  validateProductFile,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Product = Tables<"products">;

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Urun adi zorunludur."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug zorunludur.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug sadece kucuk harf, rakam ve tire icerebilir."),
  description: z.string().trim().min(1, "Aciklama zorunludur."),
  apk_url: z.string().trim(),
  pdf_url: z.string().trim(),
  whatsapp_phone: z.string().trim(),
  screenshot_urls: z.array(z.string().trim()),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormSubmitPayload = {
  values: ProductFormValues;
  files: {
    apkFile: File | null;
    pdfFile: File | null;
    screenshotFiles: File[];
  };
};

type ProductFormProps = {
  mode: "create" | "edit";
  open: boolean;
  initialProduct?: Product | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ProductFormSubmitPayload) => Promise<void>;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  apk_url: "",
  pdf_url: "",
  whatsapp_phone: "",
  screenshot_urls: [],
};

function getDefaultValues(product?: Product | null): ProductFormValues {
  if (!product) {
    return EMPTY_VALUES;
  }

  return {
    name: product.name ?? "",
    slug: product.slug ?? "",
    description: product.description ?? "",
    apk_url: product.apk_url ?? "",
    pdf_url: product.pdf_url ?? "",
    whatsapp_phone: product.whatsapp_phone ?? "",
    screenshot_urls: product.screenshot_urls,
  };
}

export function ProductForm({
  mode,
  open,
  initialProduct,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ProductFormProps) {
  const { toast } = useToast();
  const defaultValues = useMemo(() => getDefaultValues(initialProduct), [initialProduct]);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [apkUploadError, setApkUploadError] = useState("");
  const [isUploadingApk, setIsUploadingApk] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const { control, handleSubmit, reset, setValue, watch } = form;
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const currentApkUrl = watch("apk_url");
  const currentPdfUrl = watch("pdf_url");
  const currentScreenshotUrls = watch("screenshot_urls");

  useEffect(() => {
    reset(defaultValues);
    setApkFile(null);
    setPdfFile(null);
    setScreenshotFiles([]);
    setApkUploadError("");
    setIsUploadingApk(false);

    const generatedInitialSlug = createSlug(defaultValues.name);
    setIsSlugManuallyEdited(Boolean(defaultValues.slug && defaultValues.slug !== generatedInitialSlug));
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isSlugManuallyEdited) {
      return;
    }

    setValue("slug", createSlug(nameValue), {
      shouldDirty: nameValue.length > 0,
      shouldValidate: true,
    });
  }, [isSlugManuallyEdited, nameValue, setValue]);

  const dialogTitle = mode === "create" ? "Yeni urun ekle" : "Urunu duzenle";
  const dialogDescription =
    mode === "create"
      ? "Yeni bir urun kaydi olusturun. Slug alanini otomatik uretebilir veya elle degistirebilirsiniz."
      : "Secilen urunun bilgilerini guncelleyin. Degisiklikler kaydedildiginde listede aninda gorulur.";

  const handleFileValidationError = (error: unknown, target: "apk" | "pdf" | "screenshot") => {
    const message =
      error instanceof Error ? error.message : "Dosya dogrulanirken bir hata olustu.";

    if (target === "apk") {
      setApkUploadError(message);
    }

    toast({
      title: "Dosya yuklenemedi",
      description: message,
      variant: "destructive",
    });
  };

  const handleApkUpload = async () => {
    if (!apkFile) {
      setApkUploadError("Yuklemek icin once bir APK dosyasi secin.");
      return;
    }

    if (!slugValue) {
      setApkUploadError("APK yuklemeden once urun adi veya slug alanini doldurun.");
      return;
    }

    try {
      setIsUploadingApk(true);
      setApkUploadError("");
      const publicUrl = await uploadProductFile({
        file: apkFile,
        kind: "apk",
        slug: slugValue,
      });

      setValue("apk_url", publicUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast({
        title: "APK yuklendi",
        description: `Dosya ${getProductStorageBucket("apk")} bucket'ina yuklendi ve APK URL alanina eklendi.`,
      });
    } catch (error) {
      handleFileValidationError(error, "apk");
    } finally {
      setIsUploadingApk(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-primary/20 bg-card/95 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(async (values) => {
              await onSubmit({
                values,
                files: {
                  apkFile,
                  pdfFile,
                  screenshotFiles,
                },
              });
            })}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urun adi</FormLabel>
                    <FormControl>
                      <Input placeholder="FaultCode Mobil Uygulamasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel>Slug</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto px-2 py-1 text-xs text-primary"
                        onClick={() => {
                          const nextSlug = createSlug(nameValue);
                          setValue("slug", nextSlug, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setIsSlugManuallyEdited(false);
                        }}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Addan uret
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="faultcode-mobil-uygulamasi"
                        {...field}
                        onChange={(event) => {
                          setIsSlugManuallyEdited(true);
                          field.onChange(createSlug(event.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Ornek: "FaultCode Mobil Uygulamasi" {">"} "{createSlug("FaultCode Mobil Uygulamasi")}"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="apk_url"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel>APK dosyasi</FormLabel>
                      <div className="flex items-center gap-2">
                        {apkFile ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-primary/20"
                            onClick={() => {
                              void handleApkUpload();
                            }}
                            disabled={isUploadingApk || !slugValue}
                          >
                            {isUploadingApk ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Storage'a yukle
                          </Button>
                        ) : null}
                        {currentApkUrl ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-destructive"
                            onClick={() => {
                              setValue("apk_url", "", { shouldDirty: true });
                              setApkFile(null);
                              setApkUploadError("");
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Kaldir
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          placeholder="https://github.com/... veya public apk linki"
                          {...field}
                          onChange={(event) => {
                            setApkUploadError("");
                            field.onChange(event.target.value);
                          }}
                        />
                        <Input
                          type="file"
                          accept=".apk,application/vnd.android.package-archive"
                          onChange={(event) => {
                            const nextFile = event.target.files?.[0] ?? null;

                            if (!nextFile) {
                              setApkFile(null);
                              return;
                            }

                            try {
                              validateProductFile(nextFile, "apk");
                              setApkUploadError("");
                              setApkFile(nextFile);
                            } catch (error) {
                              event.currentTarget.value = "";
                              setApkFile(null);
                              handleFileValidationError(error, "apk");
                            }
                          }}
                        />
                        {apkFile ? (
                          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
                            Yeni dosya: {apkFile.name}
                          </div>
                        ) : null}
                        {apkUploadError ? (
                          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm text-destructive">
                            {apkUploadError}
                          </div>
                        ) : null}
                        {field.value ? (
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <FileArchive className="h-4 w-4" />
                            Mevcut APK dosyasini ac
                          </a>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormDescription>
                      50 MB uzerindeki APK dosyalari icin onerilen kullanim: APK'yi GitHub Releases veya Cloudflare R2'ye yukleyip public download linkini buraya yapistirin.
                    </FormDescription>
                    <FormDescription>
                      Isterseniz {getProductStorageMaxSizeMb("apk")} MB altindaki APK dosyalarini Supabase Storage'a yukleyebilirsiniz. Manuel URL girerseniz upload yapmadan o link kaydedilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="pdf_url"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel>PDF dosyasi</FormLabel>
                      {currentPdfUrl ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto px-2 py-1 text-xs text-destructive"
                          onClick={() => {
                            setValue("pdf_url", "", { shouldDirty: true });
                            setPdfFile(null);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Kaldir
                        </Button>
                      ) : null}
                    </div>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(event) => {
                            const nextFile = event.target.files?.[0] ?? null;

                            if (!nextFile) {
                              setPdfFile(null);
                              return;
                            }

                            try {
                              validateProductFile(nextFile, "pdf");
                              setPdfFile(nextFile);
                            } catch (error) {
                              event.currentTarget.value = "";
                              setPdfFile(null);
                              handleFileValidationError(error, "pdf");
                            }
                          }}
                        />
                        {pdfFile ? (
                          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
                            Yeni dosya: {pdfFile.name}
                          </div>
                        ) : null}
                        {field.value ? (
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            Mevcut PDF dosyasini ac
                          </a>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL otomatik olusur. Dosya secmezsen mevcut PDF korunur. Maksimum boyut{" "}
                      {getProductStorageMaxSizeMb("pdf")} MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="whatsapp_phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>WhatsApp telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+90 5xx xxx xx xx" {...field} />
                    </FormControl>
                    <FormDescription>Istege bagli. Oldugu gibi kaydedilir.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Aciklama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Urunun kisaca ne sundugunu aciklayin..."
                        className="min-h-36 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-border/70 bg-background/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Screenshot gorselleri</h3>
                  <p className="text-sm text-muted-foreground">
                    Gorselleri dogrudan yukleyin. URL&apos;ler Storage tarafindan otomatik uretilir.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const nextFiles = Array.from(event.target.files ?? []);

                    if (nextFiles.length === 0) {
                      setScreenshotFiles([]);
                      return;
                    }

                    const validFiles: File[] = [];

                    for (const file of nextFiles) {
                      try {
                        validateProductFile(file, "screenshot");
                        validFiles.push(file);
                      } catch (error) {
                        handleFileValidationError(error, "screenshot");
                      }
                    }

                    event.currentTarget.value = "";
                    setScreenshotFiles(validFiles);
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Her gorsel icin maksimum boyut {getProductStorageMaxSizeMb("screenshot")} MB.
                </p>

                {screenshotFiles.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Yuklenecek yeni gorseller</p>
                    <div className="space-y-2">
                      {screenshotFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Upload className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => {
                              setScreenshotFiles((currentFiles) =>
                                currentFiles.filter((_, currentIndex) => currentIndex !== index),
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {currentScreenshotUrls.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Mevcut gorseller</p>
                    <div className="space-y-2">
                      {currentScreenshotUrls.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <FileImage className="h-4 w-4 shrink-0 text-primary" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate text-primary hover:underline"
                            >
                              Screenshot {index + 1}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setValue(
                                "screenshot_urls",
                                currentScreenshotUrls.filter((_, currentIndex) => currentIndex !== index),
                                { shouldDirty: true },
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-border"
                onClick={() => onOpenChange(false)}
              >
                Vazgec
              </Button>
              <Button type="submit" disabled={isSubmitting || !slugValue}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {mode === "create" ? "Urunu kaydet" : "Degisiklikleri kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
