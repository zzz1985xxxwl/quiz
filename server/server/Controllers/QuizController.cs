using server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;

namespace server.Controllers
{
    public class QuizController : ApiController
    {
        public void Post(AnsModel model)
        {
            Save(model);
        }

        private static void Save(AnsModel ans)
        {

            StreamWriter writer = null;
            string file = Path.Combine(GetFilePath(), ans.Name + ".txt");
            try
            {
                var isStart = !File.Exists(file);
                decimal totalMinutes = 0;
                var endTime = DateTime.Now;
                if (!isStart)
                {
                    string text = System.IO.File.ReadAllText(file);
                    var regex = new Regex(@"\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d");
                    var match = regex.Matches(text);
                    foreach (var v in match)
                    {
                        var startTime = Convert.ToDateTime(v.ToString());
                        totalMinutes = decimal.Round((decimal)(endTime - startTime).TotalMinutes, 2);

                    }
                }
                writer = new StreamWriter(file, true);
                if (isStart)
                {
                    writer.WriteLine(ans.Name);
                    writer.WriteLine("start time:" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                }
                else if (ans.AnsList != null)
                {

                    writer.WriteLine("end time:" + endTime.ToString("yyyy-MM-dd HH:mm:ss"));
                    writer.WriteLine("total time:" + totalMinutes + " minutes");
                    var i = 1;
                    foreach (var a in ans.AnsList)
                    {
                        writer.WriteLine(i + " : " + a);
                        i++;
                    }
                }
            }
            catch
            {
            }
            finally
            {
                if (writer != null)
                {
                    writer.Close();
                    writer.Dispose();
                }
            }
        }

        private static string GetFilePath()
        {
            string filePath = HttpContext.Current.Server.MapPath("~/answer");
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            return filePath;
        }
    }
}
